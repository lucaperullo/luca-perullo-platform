"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * DarkStudioEnv — bakes a custom dark studio environment into a PMREM and
 * assigns it to scene.environment. Three accent area lights (warm key,
 * cool fill, magenta rim, top stripe) give the metals a cinematic feel
 * without any external HDR file.
 */
export function DarkStudioEnv() {
    const { gl, scene } = useThree();

    useEffect(() => {
        const pmrem = new THREE.PMREMGenerator(gl);
        pmrem.compileEquirectangularShader();

        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0x101015);

        const backdrop = new THREE.Mesh(
            new THREE.SphereGeometry(20, 32, 32),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                uniforms: {
                    top: { value: new THREE.Color(0x14141c) },
                    bot: { value: new THREE.Color(0x05050a) },
                },
                vertexShader: `varying vec3 v; void main(){ v = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
                fragmentShader: `varying vec3 v; uniform vec3 top; uniform vec3 bot; void main(){ float h = clamp(v.y * 0.05 + 0.5, 0.0, 1.0); gl_FragColor = vec4(mix(bot, top, h), 1.0);} `,
            }),
        );
        envScene.add(backdrop);

        const bigLight = (
            color: number,
            intensity: number,
            pos: [number, number, number],
            size: [number, number] = [4, 6],
        ) => {
            const mat = new THREE.MeshBasicMaterial({ color, toneMapped: false });
            mat.color.multiplyScalar(intensity);
            const m = new THREE.Mesh(new THREE.PlaneGeometry(...size), mat);
            m.position.set(...pos);
            m.lookAt(0, 0, 0);
            envScene.add(m);
        };

        bigLight(0xffe9c2, 6.0, [6, 5, 5], [8, 8]); // key
        bigLight(0x9bc4ff, 2.4, [-6, -3, 4], [10, 10]); // fill
        bigLight(0xff7ad9, 3.0, [-2, 4, -7], [9, 4]); // rim
        bigLight(0xffffff, 4.5, [0, 8, 0], [12, 1.4]); // top stripe

        const target = pmrem.fromScene(envScene, 0.04);
        const previous = scene.environment;
        scene.environment = target.texture;

        return () => {
            scene.environment = previous;
            target.dispose();
            pmrem.dispose();
            // dispose env scene resources
            envScene.traverse((obj) => {
                const m = obj as THREE.Mesh;
                if (m.geometry) m.geometry.dispose();
                if (m.material) {
                    const arr = Array.isArray(m.material) ? m.material : [m.material];
                    arr.forEach((mm) => mm.dispose());
                }
            });
        };
    }, [gl, scene]);

    return null;
}
