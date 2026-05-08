"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { BLOB_PRESET_BY_ID } from "./presets";

type BackgroundProps = {
    presetId: string;
};

/**
 * Soft tinted backdrop sphere — its colour is driven by the active preset
 * and lerped toward the new value each frame, matching the same easing as
 * the blob material.
 */
export function Background({ presetId }: BackgroundProps) {
    const uniforms = useMemo(() => {
        const initial = BLOB_PRESET_BY_ID[presetId] ?? BLOB_PRESET_BY_ID.chrome;
        const c = new THREE.Color(initial.bg);
        return {
            uColorTop: { value: c.clone().multiplyScalar(1.15) },
            uColorBottom: { value: c.clone().multiplyScalar(0.55) },
            uTime: { value: 0 },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFrame((state, dt) => {
        const target = BLOB_PRESET_BY_ID[presetId] ?? BLOB_PRESET_BY_ID.chrome;
        const c = new THREE.Color(target.bg);
        const k = 1 - Math.exp(-dt * 4.5);
        uniforms.uColorTop.value.lerp(c.clone().multiplyScalar(1.15), k);
        uniforms.uColorBottom.value.lerp(c.clone().multiplyScalar(0.55), k);
        uniforms.uTime.value = state.clock.getElapsedTime();
    });

    return (
        <mesh frustumCulled={false}>
            <sphereGeometry args={[50, 64, 64]} />
            <shaderMaterial
                uniforms={uniforms}
                side={THREE.BackSide}
                depthWrite={false}
                vertexShader={`
                    varying vec3 vWorld;
                    varying vec2 vUv;
                    void main(){
                        vUv = uv;
                        vWorld = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    varying vec3 vWorld;
                    varying vec2 vUv;
                    uniform vec3 uColorTop;
                    uniform vec3 uColorBottom;
                    uniform float uTime;
                    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
                    void main(){
                        vec2 c = vUv - 0.5;
                        float r = length(c);
                        float h = clamp(vWorld.y * 0.02 + 0.5, 0.0, 1.0);
                        vec3 col = mix(uColorBottom, uColorTop, smoothstep(0.0, 1.0, h));
                        col += uColorTop * (1.0 - smoothstep(0.0, 0.6, r)) * 0.18;
                        col += (hash(vUv * 1024.0 + uTime) - 0.5) * 0.012;
                        gl_FragColor = vec4(col, 1.0);
                    }
                `}
            />
        </mesh>
    );
}
