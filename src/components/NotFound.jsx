import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function NotFound({ onNavigate }) {
    const containerRef = useRef(null);
    const [isStabilized, setIsStabilized] = useState(false);
    const isStabilizedRef = useRef(false);

    // Sync state to ref for instant access inside high-speed requestAnimationFrame loops
    useEffect(() => {
        isStabilizedRef.current = isStabilized;
    }, [isStabilized]);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.025);

        const camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 8, 20);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x030303, 1);
        container.appendChild(renderer.domElement);

        // --- SINGULARITY CORE ---
        // Create the dark central event horizon sphere
        const coreGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.95
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // Create the glowing crimson corona halo around the core
        const haloGeo = new THREE.RingGeometry(2.5, 3.8, 64);
        const haloMat = new THREE.MeshBasicMaterial({
            color: 0xef4444, // Red glow
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2; // Flat disc plane
        scene.add(halo);

        // --- SWIRLING VORTEX DATA PARTICLES ---
        const particleCount = 3500;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // Store custom orbit metadata for manual simulation
        const orbits = [];

        const colorRed = new THREE.Color('#ef4444');
        const colorOrange = new THREE.Color('#f97316');
        const colorWhite = new THREE.Color('#ffffff');

        for (let i = 0; i < particleCount; i++) {
            // Logarithmic spiral distribution
            const radius = Math.random() * 15 + 3.0; // Avoid event horizon
            const angle = Math.random() * Math.PI * 2;
            const yOffset = (Math.random() - 0.5) * (15 - radius) * 0.4; // Funnel funneling down

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = yOffset - (15 / radius) * 0.1; // Pull funnel down near core

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Gradient: Inner particles are hot white/orange, outer are deep crimson red
            let mixColor = colorRed.clone();
            if (radius < 5.0) {
                mixColor = colorWhite.clone().lerp(colorOrange, Math.random());
            } else if (radius < 9.0) {
                mixColor = colorOrange.clone().lerp(colorRed, Math.random());
            }

            colors[i * 3] = mixColor.r;
            colors[i * 3 + 1] = mixColor.g;
            colors[i * 3 + 2] = mixColor.b;

            orbits.push({
                index: i,
                radius: radius,
                angle: angle,
                speed: (Math.random() * 0.02 + 0.005) * (10 / radius), // Keplerian: closer is faster
                initialY: yOffset,
                driftSpeed: Math.random() * 0.01 + 0.002
            });
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create glowing radial textured particles
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.8)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        const particleTexture = new THREE.CanvasTexture(canvas);

        const particleMat = new THREE.PointsMaterial({
            size: 0.28,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // --- INTERACTIVE MOUSE ATTRACTOR PHYSICS ---
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;
        let isMouseOver = false;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            // Map coordinates strictly relative to the canvas aspect [-1, 1]
            targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            targetMouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            isMouseOver = true;
        };

        const handleMouseLeave = () => {
            isMouseOver = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        // --- CORE ANIMATION LOOP ---
        let animationFrameId;
        const posAttribute = particleGeo.getAttribute('position');
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = Math.min(clock.getDelta(), 0.03);
            const elapsed = clock.getElapsedTime();

            // Core Pulsing Visuals
            const pulseScale = 1.0 + Math.sin(elapsed * 4) * 0.05;
            core.scale.set(pulseScale, pulseScale, pulseScale);
            halo.scale.set(pulseScale * 1.02, pulseScale * 1.02, pulseScale * 1.02);
            halo.rotation.z += 0.005;

            // Damping mouse position for smooth trailing curves
            if (isMouseOver) {
                currentMouseX += (targetMouseX - currentMouseX) * 0.1;
                currentMouseY += (targetMouseY - currentMouseY) * 0.1;
            } else {
                currentMouseX += (0 - currentMouseX) * 0.05;
                currentMouseY += (0 - currentMouseY) * 0.05;
            }

            // Attractor point mapped into 3D camera plane coordinates
            const attractorX = currentMouseX * 10;
            const attractorZ = -currentMouseY * 10;

            const isStabilizedActive = isStabilizedRef.current;

            // Simulate Keplerian orbital pull and vacuum ingestion mechanics
            for (let i = 0; i < particleCount; i++) {
                const orbit = orbits[i];

                if (isStabilizedActive) {
                    // --- STABILIZED ORBITS ---
                    // Drastically slow down rotation, flatten y coordinate, and disable inward collapse
                    orbit.angle += orbit.speed * 0.15;
                    // Easing back radius to nice circular planes
                    const targetRadius = orbit.radius + Math.sin(elapsed * 2 + orbit.index) * 0.02;
                    
                    const x = Math.cos(orbit.angle) * targetRadius;
                    const z = Math.sin(orbit.angle) * targetRadius;
                    // Ease the Y funnel heights flat towards zero
                    const currentY = posAttribute.getY(i);
                    const targetY = 0;

                    posAttribute.setXYZ(
                        i,
                        x + (currentY * 0.02), // smooth blend
                        currentY + (targetY - currentY) * 0.05,
                        z
                    );
                } else {
                    // --- WILD VORTEX ORBITS ---
                    // Orbital rotation
                    orbit.angle += orbit.speed;

                    // Inward gravitational suction drift
                    orbit.radius -= orbit.driftSpeed;

                    // Recirculate ingested data packets back to the outer ring boundaries
                    if (orbit.radius <= 2.2) {
                        orbit.radius = 16.5;
                        orbit.angle = Math.random() * Math.PI * 2;
                    }

                    // Logarithmic funnel height equation
                    const funnelHeight = orbit.initialY - (8 / orbit.radius) * 0.25;

                    let x = Math.cos(orbit.angle) * orbit.radius;
                    let z = Math.sin(orbit.angle) * orbit.radius;
                    let y = funnelHeight;

                    // Apply dynamic gravitational warp distortion mapping towards the mouse coordinates
                    if (isMouseOver) {
                        const dx = attractorX - x;
                        const dz = attractorZ - z;
                        const distToMouse = Math.sqrt(dx * dx + dz * dz);

                        // If particle is in the influence radius of the cursor attractor
                        if (distToMouse < 8.0) {
                            const force = (8.0 - distToMouse) * 0.08;
                            x += dx * force;
                            z += dz * force;
                            y += (attractorZ * 0.1 * force);
                        }
                    }

                    posAttribute.setXYZ(i, x, y, z);
                }
            }

            posAttribute.needsUpdate = true;

            // Slow rotate camera around the gravity well
            if (!isStabilizedActive) {
                camera.position.x = Math.sin(elapsed * 0.08) * 22;
                camera.position.z = Math.cos(elapsed * 0.08) * 22;
                camera.position.y = 8 + Math.sin(elapsed * 0.15) * 3;
            } else {
                // Stabilized camera snaps to an elegant top-down cyber-radar angle
                camera.position.x += (0 - camera.position.x) * 0.05;
                camera.position.z += (20 - camera.position.z) * 0.05;
                camera.position.y += (12 - camera.position.y) * 0.05;
            }
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // --- RESPONSIVE ADJUSTMENTS ---
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (container) {
                container.removeEventListener('mouseleave', handleMouseLeave);
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            }
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            coreGeo.dispose();
            coreMat.dispose();
            haloGeo.dispose();
            haloMat.dispose();
            particleGeo.dispose();
            particleMat.dispose();
            particleTexture.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-[#030303] text-white overflow-hidden select-none font-sans flex items-center justify-center">
            
            {/* 3D WebGL Canvas Layer */}
            <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-auto" />

            {/* Futuristic Scanner Scanlines */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj48cGF0aCBkPSJNMzAgMEgwVjMwSDMwVjBaTTEgMjlIMSBMMSAxaDI4djI4SDFaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDA0Ii8+PC9zdmc+')] pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black pointer-events-none z-10" />

            {/* Glowing HUD Interface Overlay */}
            <div className="relative z-20 max-w-xl w-full mx-6 p-8 md:p-10 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.08)] flex flex-col items-center text-center">
                
                {/* Cybersecurity Encrypted Tag */}
                <div className="font-mono text-xs text-red-500 tracking-[0.4em] uppercase font-bold mb-4 flex items-center space-x-2">
                    <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isStabilized ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isStabilized ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span>{isStabilized ? '[ GRID_STABILIZED ]' : '[ PATH_VACUUM_COLLAPSE ]'}</span>
                </div>

                {/* Glitch Error Header */}
                <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-white drop-shadow-[0_0_35px_rgba(239,68,68,0.4)] select-none uppercase mb-4 animate-pulse">
                    404
                </h1>

                {/* Cyber Description */}
                <p className="text-gray-300 font-light text-base md:text-lg tracking-wide leading-relaxed mb-8 max-w-sm">
                    {isStabilized 
                        ? 'System core frequency stabilized. Data containment field active. The network exit vector has been fully restored.'
                        : 'Your destination was swallowed by a gravity well anomaly. The data packets have collapsed past the event horizon.'}
                </p>

                {/* Floating Telemetry Box */}
                <div className="w-full font-mono text-[10px] text-gray-500 border border-white/5 bg-white/[0.01] px-5 py-4 rounded-xl text-left space-y-2.5 mb-8 tracking-wider uppercase select-none">
                    <div className="flex justify-between">
                        <span>ERROR STATUS:</span>
                        <span className="text-red-500 font-bold">ROUTE_DECOUPLED</span>
                    </div>
                    <div className="flex justify-between">
                        <span>SINGULARITY SCALE:</span>
                        <span className="text-orange-400">4.02 G-MASS</span>
                    </div>
                    <div className="flex justify-between">
                        <span>PACKET CONTAINER:</span>
                        <span className={isStabilized ? 'text-emerald-400' : 'text-red-500 animate-pulse'}>
                            {isStabilized ? 'STABLE (100%)' : 'COLLAPSED (0.2%)'}
                        </span>
                    </div>
                </div>

                {/* Actions Panel */}
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <button
                        onMouseEnter={() => setIsStabilized(true)}
                        onMouseLeave={() => setIsStabilized(false)}
                        onClick={() => onNavigate('/')}
                        className="flex-1 px-8 py-4 font-mono text-xs tracking-[0.2em] font-bold text-white uppercase rounded-full border border-red-500/30 bg-black shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-500 hover:scale-[1.02] hover:border-red-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.3)] active:scale-95 cursor-pointer relative group overflow-hidden"
                    >
                        {/* Animated Shimmer sweep */}
                        <span className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10">Escape Anomaly</span>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                `
            }} />
        </div>
    );
}
