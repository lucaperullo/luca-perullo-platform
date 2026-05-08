"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { noiseGLSL, vertexInjection } from "./shaders";
import {
    BLOB_PRESET_BY_ID,
    COLOR_MAT_KEYS,
    NUMERIC_MAT_KEYS,
    SHAPE_KEYS,
    type BlobPreset,
} from "./presets";

type Uniforms = {
    uTime: { value: number };
    uNoiseScale: { value: number };
    uNoiseSpeed: { value: number };
    uDisplace: { value: number };
    uRoundness: { value: number };
    uPulse: { value: number };
    uPointer: { value: THREE.Vector3 };
    uPointerForce: { value: number };
    uChaos: { value: number };
};

type BlobProps = {
    /** Preset ID — switching this lerps every parameter every frame */
    presetId: string;
    /** Geometry subdivision — 64 reads well in a 320px tile, 128 fills a hero */
    detail?: number;
    /** Optional callback when bloom-strength target changes */
    onBloomChange?: (strength: number) => void;
};

/**
 * Blob — high-poly icosahedron driven by simplex-noise vertex displacement,
 * rendered with MeshPhysicalMaterial (PBR). The displacement and analytic
 * normal recomputation are injected into the standard PBR shader via
 * onBeforeCompile so transmission, iridescence, clearcoat and sheen all
 * keep working on the displaced surface.
 *
 * Switching `presetId` doesn't snap any property — every numeric value lerps
 * each frame at ~6%/frame (≈250 ms half-life), every colour RGB-lerps the
 * same way. Same easing as the original blobmixer.14islands site.
 */
export function Blob({ presetId, detail = 96, onBloomChange }: BlobProps) {
    const { camera, raycaster, pointer } = useThree();

    // --- uniforms ----------------------------------------------------------
    const uniforms = useMemo<Uniforms>(() => {
        const initial = BLOB_PRESET_BY_ID[presetId] ?? BLOB_PRESET_BY_ID.chrome;
        return {
            uTime: { value: 0 },
            uNoiseScale: { value: initial.shape.noiseScale },
            uNoiseSpeed: { value: initial.shape.noiseSpeed },
            uDisplace: { value: initial.shape.displace },
            uRoundness: { value: initial.shape.roundness },
            uPulse: { value: initial.shape.pulse },
            uPointer: { value: new THREE.Vector3(99, 99, 99) },
            uPointerForce: { value: 0 },
            uChaos: { value: initial.shape.chaos },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- material ----------------------------------------------------------
    const material = useMemo(() => {
        const initial = BLOB_PRESET_BY_ID[presetId] ?? BLOB_PRESET_BY_ID.chrome;
        const mat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(initial.material.color),
            metalness: initial.material.metalness,
            roughness: initial.material.roughness,
            envMapIntensity: initial.material.envMapIntensity,
            clearcoat: initial.material.clearcoat,
            clearcoatRoughness: initial.material.clearcoatRoughness,
            iridescence: initial.material.iridescence,
            iridescenceIOR: initial.material.iridescenceIOR,
            iridescenceThicknessRange: [...initial.material.iridescenceThicknessRange],
            sheen: initial.material.sheen,
            sheenColor: new THREE.Color(initial.material.sheenColor),
            sheenRoughness: initial.material.sheenRoughness,
            transmission: initial.material.transmission,
            thickness: initial.material.thickness,
            ior: initial.material.ior,
            attenuationColor: new THREE.Color(initial.material.attenuationColor),
            attenuationDistance: initial.material.attenuationDistance,
            specularIntensity: initial.material.specularIntensity,
            opacity: initial.material.opacity,
            transparent: initial.material.transparent,
            side: THREE.FrontSide,
        });

        mat.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, uniforms);
            shader.vertexShader = shader.vertexShader.replace(
                "void main() {",
                `${noiseGLSL}\nvoid main() {`,
            );
            shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>\n${vertexInjection}`,
            );
        };

        return mat;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- core glow (used for plasma / lava) --------------------------------
    const coreUniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uIntensity: { value: 0 },
            uColorA: { value: new THREE.Color("#ff6a3d") },
            uColorB: { value: new THREE.Color("#ffe97f") },
        }),
        [],
    );
    const coreMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: coreUniforms,
                vertexShader: /* glsl */ `
                    varying vec3 vN; varying vec3 vP;
                    void main(){
                        vN = normalize(normalMatrix * normal);
                        vP = (modelViewMatrix * vec4(position,1.0)).xyz;
                        gl_Position = projectionMatrix * vec4(vP,1.0);
                    }
                `,
                fragmentShader: /* glsl */ `
                    uniform float uTime; uniform float uIntensity;
                    uniform vec3 uColorA; uniform vec3 uColorB;
                    varying vec3 vN; varying vec3 vP;
                    void main(){
                        vec3 v = normalize(-vP);
                        float fres = pow(1.0 - max(dot(v, vN), 0.0), 2.2);
                        float pulse = 0.6 + 0.4 * sin(uTime * 1.4);
                        vec3 col = mix(uColorA, uColorB, fres) * pulse;
                        gl_FragColor = vec4(col * uIntensity, fres * uIntensity);
                    }
                `,
            }),
        [coreUniforms],
    );

    const meshRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    // dispose on unmount
    useEffect(() => {
        return () => {
            material.dispose();
            coreMaterial.dispose();
        };
    }, [material, coreMaterial]);

    // pointer pickup — raycast against a plane facing the camera through origin
    const pickPlane = useMemo(() => new THREE.Plane(), []);
    const pickPoint = useMemo(() => new THREE.Vector3(99, 99, 99), []);
    const pointerForceRef = useRef(0);
    const pointerForceTargetRef = useRef(0);

    useEffect(() => {
        const onDown = () => (pointerForceTargetRef.current = 1);
        const onUp = () => (pointerForceTargetRef.current = 0);
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        return () => {
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
        };
    }, []);

    // last known target — emit bloom changes when crossing thresholds
    const lastBloomRef = useRef<number | null>(null);

    useFrame((state, dt) => {
        const target: BlobPreset =
            BLOB_PRESET_BY_ID[presetId] ?? BLOB_PRESET_BY_ID.chrome;

        // damping: ~6% per 60-fps frame, scaled by dt for framerate independence
        const k = 1 - Math.exp(-dt * 4.5);

        // --- material numeric props
        for (const key of NUMERIC_MAT_KEYS) {
            const cur = (material as unknown as Record<string, number>)[key];
            const tgt = (target.material as unknown as Record<string, number>)[key];
            (material as unknown as Record<string, number>)[key] = cur + (tgt - cur) * k;
        }

        // --- material colours
        for (const key of COLOR_MAT_KEYS) {
            const c = (material as unknown as Record<string, THREE.Color>)[key];
            const targetCol = new THREE.Color(
                (target.material as unknown as Record<string, string>)[key],
            );
            c.lerp(targetCol, k);
        }

        // iridescenceThicknessRange tween
        const [a0, a1] = material.iridescenceThicknessRange;
        const [t0, t1] = target.material.iridescenceThicknessRange;
        material.iridescenceThicknessRange = [a0 + (t0 - a0) * k, a1 + (t1 - a1) * k];

        // transparent flag — snap (driver of needsUpdate)
        if (material.transparent !== target.material.transparent) {
            material.transparent = target.material.transparent;
            material.needsUpdate = true;
        }

        // --- shape uniforms
        for (const key of SHAPE_KEYS) {
            const uKey = ("u" + key.charAt(0).toUpperCase() + key.slice(1)) as keyof Uniforms;
            const u = uniforms[uKey] as { value: number };
            u.value += (target.shape[key] - u.value) * k;
        }

        // --- core glow
        coreUniforms.uIntensity.value +=
            ((target.core.intensity ?? 0) - coreUniforms.uIntensity.value) * k;
        if (target.core.colorA)
            coreUniforms.uColorA.value.lerp(new THREE.Color(target.core.colorA), k);
        if (target.core.colorB)
            coreUniforms.uColorB.value.lerp(new THREE.Color(target.core.colorB), k);
        if (coreRef.current) {
            coreRef.current.visible = coreUniforms.uIntensity.value > 0.01;
        }

        // --- bloom strength callback
        if (onBloomChange && lastBloomRef.current !== target.bloom) {
            onBloomChange(target.bloom);
            lastBloomRef.current = target.bloom;
        }

        // --- time + pointer
        const t = state.clock.getElapsedTime();
        uniforms.uTime.value = t;
        coreUniforms.uTime.value = t;

        // pointer raycast: a plane facing the camera through the origin
        pickPlane.normal.copy(camera.position).normalize();
        pickPlane.constant = 0;
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(pickPlane, pickPoint)) {
            uniforms.uPointer.value.copy(pickPoint);
        }
        pointerForceRef.current +=
            (pointerForceTargetRef.current - pointerForceRef.current) * k * 1.5;
        uniforms.uPointerForce.value = pointerForceRef.current;

        // floating spin
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.08;
            meshRef.current.rotation.x = Math.sin(t * 0.18) * 0.1;
        }
        if (coreRef.current) {
            coreRef.current.rotation.copy(meshRef.current!.rotation);
        }
    });

    return (
        <group>
            <mesh ref={meshRef} frustumCulled={false} material={material}>
                <icosahedronGeometry args={[1, detail]} />
            </mesh>
            <mesh ref={coreRef} visible={false} material={coreMaterial}>
                <icosahedronGeometry args={[0.78, 12]} />
            </mesh>
        </group>
    );
}
