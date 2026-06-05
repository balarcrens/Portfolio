/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three/webgpu';
import {
    pass, uniform, Fn, Loop, Break, If, screenUV,
    vec2, vec3, vec4, float,
    length, normalize, cross, dot, sin, cos, atan, asin, sqrt, pow,
    fract, clamp, smoothstep, mix, floor, step, sign
} from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================================================
// SIMULATION PHYSICS CONFIGURATION
// ============================================================================
const config = {
    blackHoleMass: 0.4,
    diskInnerRadius: 4.1,
    diskOuterRadius: 14.5,
    diskTemperature: 49.78,
    temperatureFalloff: 5.22,
    diskBrightness: 5.0,
    diskRotationSpeed: -8.7,
    turbulenceScale: 1.81,
    turbulenceStretch: 0.75,
    turbulenceSharpness: 7.4,
    turbulenceCycleTime: 5.0,
    turbulenceLacunarity: 2.5,
    turbulencePersistence: 0.8,
    diskEdgeSoftnessInner: 0.18,
    diskEdgeSoftnessOuter: 0.5,
    gravitationalLensing: 2.4,
    dopplerStrength: 1.0,
    stepSize: 1.0,
    starsEnabled: true,
    starBackgroundColor: '#000000',
    starDensity: 0.1,
    starSize: 1.2,
    starBrightness: 0.1,
    nebulaEnabled: true,
    nebula1Scale: 2.0,
    nebula1Density: 0.5,
    nebula1Brightness: 0.01,
    nebula1Color: '#071f44',
    nebula2Scale: 5.5,
    nebula2Density: 0.05,
    nebula2Brightness: 0.21,
    nebula2Color: '#010615',
    bloomStrength: 0.68,
    bloomRadius: 0.0,
    bloomThreshold: 0.45
};

// ============================================================================
// NODE SHADER UNIFORMS
// ============================================================================
const uniforms = {
    blackHoleMass: uniform(config.blackHoleMass),
    diskInnerRadius: uniform(config.diskInnerRadius),
    diskOuterRadius: uniform(config.diskOuterRadius),
    diskTemperature: uniform(config.diskTemperature),
    temperatureFalloff: uniform(config.temperatureFalloff),
    diskBrightness: uniform(config.diskBrightness),
    diskRotationSpeed: uniform(config.diskRotationSpeed),
    turbulenceScale: uniform(config.turbulenceScale),
    turbulenceStretch: uniform(config.turbulenceStretch),
    turbulenceSharpness: uniform(config.turbulenceSharpness),
    turbulenceCycleTime: uniform(config.turbulenceCycleTime),
    turbulenceLacunarity: uniform(config.turbulenceLacunarity),
    turbulencePersistence: uniform(config.turbulencePersistence),
    diskEdgeSoftnessInner: uniform(config.diskEdgeSoftnessInner),
    diskEdgeSoftnessOuter: uniform(config.diskEdgeSoftnessOuter),
    gravitationalLensing: uniform(config.gravitationalLensing),
    dopplerStrength: uniform(config.dopplerStrength),
    stepSize: uniform(config.stepSize),
    starsEnabled: uniform(config.starsEnabled ? 1.0 : 0.0),
    starBackgroundColor: uniform(new THREE.Color(config.starBackgroundColor)),
    starDensity: uniform(config.starDensity),
    starSize: uniform(config.starSize),
    starBrightness: uniform(config.starBrightness),
    nebulaEnabled: uniform(config.nebulaEnabled ? 1.0 : 0.0),
    nebula1Scale: uniform(config.nebula1Scale),
    nebula1Density: uniform(config.nebula1Density),
    nebula1Brightness: uniform(config.nebula1Brightness),
    nebula1Color: uniform(new THREE.Color(config.nebula1Color)),
    nebula2Scale: uniform(config.nebula2Scale),
    nebula2Density: uniform(config.nebula2Density),
    nebula2Brightness: uniform(config.nebula2Brightness),
    nebula2Color: uniform(new THREE.Color(config.nebula2Color)),
    time: uniform(0.0),
    resolution: uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
    cameraPosition: uniform(new THREE.Vector3(0, 5, 20)),
    cameraTarget: uniform(new THREE.Vector3(0, 0, 0))
};

// ============================================================================
// RELATIVISTIC RAYMARCHING SHADER FUNCTIONS (TSL)
// ============================================================================
const hash21 = Fn(([p]) => {
    const n = sin(dot(p, vec2(127.1, 311.7))).mul(43758.5453);
    return fract(n);
});

const hash31 = Fn(([p]) => {
    const n = sin(dot(p, vec3(127.1, 311.7, 74.7))).mul(43758.5453);
    return fract(n);
});

const hash22 = Fn(([p]) => {
    const px = fract(sin(dot(p, vec2(127.1, 311.7))).mul(43758.5453));
    const py = fract(sin(dot(p, vec2(269.5, 183.3))).mul(43758.5453));
    return vec2(px, py);
});

const noise3D = Fn(([p]) => {
    const i = floor(p);
    const f = fract(p);
    const u = f.mul(f).mul(float(3.0).sub(f.mul(2.0)));
    const a = hash31(i);
    const b = hash31(i.add(vec3(1, 0, 0)));
    const c = hash31(i.add(vec3(0, 1, 0)));
    const d = hash31(i.add(vec3(1, 1, 0)));
    const e = hash31(i.add(vec3(0, 0, 1)));
    const f2 = hash31(i.add(vec3(1, 0, 1)));
    const g = hash31(i.add(vec3(0, 1, 1)));
    const h = hash31(i.add(vec3(1, 1, 1)));
    return mix(
        mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
        mix(mix(e, f2, u.x), mix(g, h, u.x), u.y),
        u.z
    );
});

const fbm = Fn(([p, lacunarity, persistence]) => {
    const value = float(0.0).toVar();
    const amplitude = float(0.5).toVar();
    const pos = p.toVar();
    value.addAssign(noise3D(pos).mul(amplitude));
    pos.mulAssign(lacunarity); amplitude.mulAssign(persistence);
    value.addAssign(noise3D(pos).mul(amplitude));
    pos.mulAssign(lacunarity); amplitude.mulAssign(persistence);
    value.addAssign(noise3D(pos).mul(amplitude));
    pos.mulAssign(lacunarity); amplitude.mulAssign(persistence);
    value.addAssign(noise3D(pos).mul(amplitude));
    return value;
});

const blackbodyColor = Fn(([tempK]) => {
    const t = clamp(tempK.sub(1000.0).div(9000.0), float(0.0), float(1.0));
    const red = clamp(float(1.0).sub(t.sub(0.8).mul(2.0)), float(0.5), float(1.0));
    const green = smoothstep(float(0.0), float(0.5), t)
        .mul(float(1.0).sub(t.sub(0.7).mul(0.3).max(0.0)));
    const blue = smoothstep(float(0.3), float(1.0), t).mul(t);
    return vec3(red, green, blue);
});

const starField = Fn(([rayDir]) => {
    const theta = atan(rayDir.z, rayDir.x);
    const phi = asin(clamp(rayDir.y, float(-1.0), float(1.0)));
    const gridScale = float(60.0).div(uniforms.starSize);
    const scaledCoord = vec2(theta, phi).mul(gridScale);
    const cell = floor(scaledCoord);
    const cellUV = fract(scaledCoord);
    const cellHash = hash21(cell);
    const starProb = step(float(1.0).sub(uniforms.starDensity), cellHash);
    const starPos = hash22(cell.add(42.0)).mul(0.8).add(0.1);
    const distToStar = length(cellUV.sub(starPos));
    const baseSizeVar = hash21(cell.add(100.0)).mul(0.03).add(0.01);
    const finalStarSize = baseSizeVar.mul(uniforms.starSize);
    const starCore = smoothstep(finalStarSize, float(0.0), distToStar);
    const starGlow = smoothstep(finalStarSize.mul(3.0), float(0.0), distToStar).mul(0.3);
    const starIntensity = starCore.add(starGlow).mul(starProb);
    const colorTemp = hash21(cell.add(200.0));
    const starColor = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.95, 0.8), colorTemp);
    return starColor.mul(starIntensity).mul(uniforms.starBrightness);
});

const nebulaField = Fn(([rayDir]) => {
    const noisePos1 = rayDir.mul(uniforms.nebula1Scale);
    const n1 = fbm(noisePos1, float(2.0), float(0.5)).mul(2.0).sub(1.0);
    const layer1 = clamp(n1.add(uniforms.nebula1Density), float(0.0), float(1.0));
    const color1 = uniforms.nebula1Color.mul(layer1).mul(uniforms.nebula1Brightness);
    const noisePos2 = rayDir.mul(uniforms.nebula2Scale);
    const n2 = fbm(noisePos2, float(2.0), float(0.5)).mul(2.0).sub(1.0);
    const layer2 = clamp(n2.add(uniforms.nebula2Density), float(0.0), float(1.0));
    const color2 = uniforms.nebula2Color.mul(layer2).mul(uniforms.nebula2Brightness);
    return color1.add(color2);
});

const accretionDiskColor = Fn(([hitR, hitAngle, timeVal, rayDir]) => {
    const innerR = uniforms.diskInnerRadius;
    const outerR = uniforms.diskOuterRadius;
    const normR = clamp(hitR.sub(innerR).div(outerR.sub(innerR)), float(0.0), float(1.0));

    const peakTempK = uniforms.diskTemperature.mul(1000.0);
    const outerTempK = float(1500.0);
    const tempFalloff = pow(innerR.div(hitR), uniforms.temperatureFalloff);
    const tempK = mix(outerTempK, peakTempK, tempFalloff);
    const diskColor = blackbodyColor(tempK).toVar('diskColor');

    const rotationSign = sign(uniforms.diskRotationSpeed);
    const velocityDir = vec3(
        sin(hitAngle).negate().mul(rotationSign),
        float(0.0),
        cos(hitAngle).mul(rotationSign)
    );
    const velocityMagnitude = float(1.0).div(sqrt(hitR.div(innerR)));
    const beta = velocityMagnitude.mul(0.3);
    const cosTheta = dot(velocityDir, rayDir);
    const dopplerFactor = float(1.0).div(float(1.0).sub(beta.mul(cosTheta)));
    const dopplerBoost = pow(dopplerFactor, float(3.0).mul(uniforms.dopplerStrength));
    diskColor.mulAssign(clamp(dopplerBoost, float(0.1), float(5.0)));

    const edgeFalloff = smoothstep(float(0.0), uniforms.diskEdgeSoftnessInner, normR)
        .mul(smoothstep(float(1.0), float(1.0).sub(uniforms.diskEdgeSoftnessOuter), normR));

    const ringOpacity = float(1.0).toVar('ringOpacity');
    const cycleLength = uniforms.turbulenceCycleTime;
    const cyclicTime = timeVal.mod(cycleLength);
    const blendFactor = cyclicTime.div(cycleLength);
    const keplerianPhase1 = cyclicTime.mul(uniforms.diskRotationSpeed).div(pow(hitR, float(1.5)));
    const keplerianPhase2 = cyclicTime.add(cycleLength).mul(uniforms.diskRotationSpeed).div(pow(hitR, float(1.5)));
    const rotatedAngle1 = hitAngle.add(keplerianPhase1);
    const rotatedAngle2 = hitAngle.add(keplerianPhase2);
    const noiseCoord1 = vec3(
        hitR.mul(uniforms.turbulenceScale),
        cos(rotatedAngle1).div(uniforms.turbulenceStretch.max(0.1)),
        sin(rotatedAngle1).div(uniforms.turbulenceStretch.max(0.1))
    );
    const noiseCoord2 = vec3(
        hitR.mul(uniforms.turbulenceScale),
        cos(rotatedAngle2).div(uniforms.turbulenceStretch.max(0.1)),
        sin(rotatedAngle2).div(uniforms.turbulenceStretch.max(0.1))
    );
    const turbulence1 = fbm(noiseCoord1, uniforms.turbulenceLacunarity, uniforms.turbulencePersistence);
    const turbulence2 = fbm(noiseCoord2, uniforms.turbulenceLacunarity, uniforms.turbulencePersistence);
    const turbulence = mix(turbulence2, turbulence1, blendFactor);
    ringOpacity.assign(pow(clamp(turbulence, float(0.0), float(1.0)), uniforms.turbulenceSharpness));

    const finalOpacity = ringOpacity.mul(edgeFalloff);
    const finalColor = diskColor.mul(uniforms.diskBrightness);
    return vec4(finalColor, finalOpacity);
});

const blackHoleShader = Fn(() => {
    const rs = uniforms.blackHoleMass.mul(2.0);
    const uv = screenUV.sub(0.5).mul(2.0);
    const aspect = uniforms.resolution.x.div(uniforms.resolution.y);
    const screenPos = vec2(uv.x.mul(aspect), uv.y);

    const camPos = uniforms.cameraPosition;
    const camTarget = uniforms.cameraTarget;
    const camForward = normalize(camTarget.sub(camPos));
    const worldUp = vec3(0.0, 1.0, 0.0);
    const camRight = normalize(cross(worldUp, camForward));
    const camUp = cross(camForward, camRight);

    const fov = float(1.0);
    const rayDir = normalize(
        camForward.mul(fov).add(camRight.mul(screenPos.x)).add(camUp.mul(screenPos.y))
    ).toVar('rayDir');

    const rayPos = camPos.toVar('rayPos');
    const prevPos = camPos.toVar('prevPos');
    const color = vec3(0.0, 0.0, 0.0).toVar('color');
    const alpha = float(0.0).toVar('alpha');
    const escaped = float(0.0).toVar('escaped');
    const captured = float(0.0).toVar('captured');
    const innerR = uniforms.diskInnerRadius;
    const outerR = uniforms.diskOuterRadius;

    Loop(32, () => {
        If(escaped.greaterThan(0.5).or(captured.greaterThan(0.5)).or(alpha.greaterThan(0.99)), () => {
            Break();
        });

        const r = length(rayPos);

        If(r.lessThan(rs.mul(1.01)), () => {
            captured.assign(1.0);
            Break();
        });

        If(r.greaterThan(100.0), () => {
            escaped.assign(1.0);
            Break();
        });

        const toCenter = rayPos.negate().div(r);
        const bendStrength = rs.div(r.mul(r)).mul(uniforms.stepSize).mul(uniforms.gravitationalLensing);
        rayDir.addAssign(toCenter.mul(bendStrength));
        rayDir.assign(normalize(rayDir));

        prevPos.assign(rayPos);
        rayPos.addAssign(rayDir.mul(uniforms.stepSize));

        const crossedPlane = prevPos.y.mul(rayPos.y).lessThan(0.0);
        If(crossedPlane.and(alpha.lessThan(0.99)), () => {
            const t = prevPos.y.negate().div(rayPos.y.sub(prevPos.y));
            const hitPos = mix(prevPos, rayPos, t);
            const hitR = sqrt(hitPos.x.mul(hitPos.x).add(hitPos.z.mul(hitPos.z)));
            const inDisk = hitR.greaterThan(innerR).and(hitR.lessThan(outerR));
            If(inDisk, () => {
                const hitAngle = atan(hitPos.z, hitPos.x);
                const diskResult = accretionDiskColor(hitR, hitAngle, uniforms.time, rayDir);
                const remainingAlpha = float(1.0).sub(alpha);
                color.addAssign(diskResult.xyz.mul(diskResult.w).mul(remainingAlpha));
                alpha.addAssign(remainingAlpha.mul(diskResult.w));
            });
        });
    });

    If(captured.lessThan(0.5), () => {
        escaped.assign(1.0);
    });

    If(escaped.greaterThan(0.5).and(alpha.lessThan(0.99)), () => {
        const bgColor = uniforms.starBackgroundColor.toVar('bgColor');
        If(uniforms.starsEnabled.greaterThan(0.5), () => {
            bgColor.addAssign(starField(rayDir));
        });
        If(uniforms.nebulaEnabled.greaterThan(0.5), () => {
            bgColor.addAssign(nebulaField(rayDir));
        });
        color.addAssign(bgColor.mul(float(1.0).sub(alpha)));
    });

    const finalColor = pow(color, vec3(1.0 / 2.2));
    return vec4(finalColor, 1.0);
})();

// ============================================================================
// REACT PURE CANVAS CONTAINER COMPONENT
// ============================================================================
export default function BlackHole() {
    const containerRef = useRef(null);
    const sectionRef = useRef(null);

    // Browser WebGPU support state
    const [webgpuSupported, setWebgpuSupported] = useState(true);

    // Animation and resources references
    const animationFrameId = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const postRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Set up Intersection Observer to pause rendering when out of viewport
        let isVisible = true;
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0.02 });
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, -2, -18);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGPURenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        rendererRef.current = renderer;

        try {
            container.appendChild(renderer.domElement);
        } catch (e) {
            console.error("DOM attachment failed. Browser likely unsupported.", e);
            setWebgpuSupported(false);
            return;
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = -0.5;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controlsRef.current = controls;

        // Intercept and stop wheel scroll events in the capture phase.
        // This blocks OrbitControls from hijacking the mouse wheel, letting the browser
        // scroll the website page naturally, while keeping touch pinch-to-zoom active.
        const stopWheelZoom = (e) => {
            e.stopPropagation();
        };
        renderer.domElement.addEventListener('wheel', stopWheelZoom, { capture: true });
        renderer.domElement._stopWheelZoom = stopWheelZoom; // Keep reference for clean cleanup

        // Relativistic sphere mapped to the raymarching node
        const geometry = new THREE.SphereGeometry(100, 32, 32);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicNodeMaterial();
        material.colorNode = blackHoleShader;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        scene.add(mesh);

        let lastFrameTime = performance.now();

        function updateCameraUniforms() {
            uniforms.cameraPosition.value.copy(camera.position);
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(camera.quaternion);
            const target = camera.position.clone().add(direction.multiplyScalar(10));
            uniforms.cameraTarget.value.copy(target);
        }

        function renderLoop() {
            animationFrameId.current = requestAnimationFrame(renderLoop);
            if (!isVisible) return; // Pause calculations and renders when off-screen!

            const currentTime = performance.now();
            const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.033);
            lastFrameTime = currentTime;

            controls.update();
            uniforms.time.value += deltaTime;
            updateCameraUniforms();

            if (postRef.current) {
                postRef.current.render();
            } else {
                renderer.render(scene, camera);
            }
        }

        renderer.init().then(() => {
            const postProcessing = new THREE.PostProcessing(renderer);
            const scenePass = pass(scene, camera);
            const scenePassColor = scenePass.getTextureNode();
            const bloomPass = bloom(scenePassColor);
            bloomPass.threshold.value = config.bloomThreshold;
            bloomPass.strength.value = config.bloomStrength;
            bloomPass.radius.value = config.bloomRadius;
            postProcessing.outputNode = scenePassColor.add(bloomPass);
            postRef.current = postProcessing;

            renderLoop();
        }).catch(err => {
            console.error('WebGPU initialization failed:', err);
            setWebgpuSupported(false);
        });

        const handleResize = () => {
            if (!containerRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
            uniforms.resolution.value.set(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            if (rendererRef.current) {
                if (rendererRef.current.domElement) {
                    if (rendererRef.current.domElement._stopWheelZoom) {
                        rendererRef.current.domElement.removeEventListener('wheel', rendererRef.current.domElement._stopWheelZoom, { capture: true });
                    }
                    if (container.contains(rendererRef.current.domElement)) {
                        container.removeChild(rendererRef.current.domElement);
                    }
                }
                rendererRef.current.dispose();
            }

            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <section
            id="singularity"
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden select-none"
        >
            {webgpuSupported ? (
                <div ref={containerRef} className="absolute bg-transparent inset-0 z-0 pointer-events-auto" />
            ) : (
                <div className="absolute inset-0 z-0 bg-black flex flex-col items-center justify-center text-center p-6">
                    <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-6">
                        <div className="absolute w-[120px] h-[120px] bg-black rounded-full shadow-[0_0_80px_25px_rgba(239,68,68,0.5)] animate-pulse" />
                        <div className="absolute w-[220px] h-[220px] rounded-full border border-red-500/10 animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'rgba(239,68,68,0.5)', borderRightColor: 'rgba(249,115,22,0.5)' }} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold mb-3">
                        [ WebGPU Offline ]
                    </span>
                    <p className="text-gray-500 text-xs font-light leading-relaxed max-w-xs">
                        This relativistic portal requires hardware-accelerated WebGPU. Please use Google Chrome (113+) or Microsoft Edge (113+).
                    </p>
                </div>
            )}

            {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj48cGF0aCBkPSJNMzAgMEgwVjMwSDMwVjBaTTEgMjlIMSBMMSAxaDI4djI4SDFaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDA1Ii8+PC9zdmc+')] pointer-events-none z-1" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-1" /> */}
        </section>
    );
}
