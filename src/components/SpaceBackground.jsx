import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three/webgpu';
import {
  pass, uniform, Fn, Loop, Break, If, screenUV,
  vec2, vec3, vec4, float,
  length, normalize, cross, dot, sin, cos, atan, asin, sqrt, pow,
  fract, clamp, smoothstep, mix, floor, step, sign
} from 'three/tsl';

// ============================================================================
// SIMULATION CONFIGURATION
// ============================================================================
const config = {
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
  nebula2Color: '#010615'
};

// ============================================================================
// NODE SHADER UNIFORMS
// ============================================================================
const uniforms = {
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
// NOISE & GENERATIVE HELPER FUNCTIONS (TSL)
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

const spaceBgShader = Fn(() => {
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
  );

  const bgColor = uniforms.starBackgroundColor.toVar('bgColor');
  If(uniforms.starsEnabled.greaterThan(0.5), () => {
    bgColor.addAssign(starField(rayDir));
  });
  If(uniforms.nebulaEnabled.greaterThan(0.5), () => {
    bgColor.addAssign(nebulaField(rayDir));
  });

  const finalColor = pow(bgColor, vec3(1.0 / 2.2));
  return vec4(finalColor, 1.0);
})();

// ============================================================================
// REACT SPACE BACKGROUND CANVAS COMPONENT
// ============================================================================
export default function SpaceBackground() {
  const containerRef = useRef(null);

  // Browser WebGPU support state
  const [webgpuSupported, setWebgpuSupported] = useState(true);

  // Animation and resources references
  const animationFrameId = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const w = window.innerWidth;
    const h = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    // Initial camera placement
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGPURenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    try {
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("DOM attachment failed for SpaceBackground.", e);
      setWebgpuSupported(false);
      return;
    }

    // Large background sphere
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicNodeMaterial();
    material.colorNode = spaceBgShader;
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

      const currentTime = performance.now();
      const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.033);
      lastFrameTime = currentTime;

      uniforms.time.value += deltaTime;

      // Slowly rotate camera to make the background drift dynamically (approx. 0.003 rad/s)
      const driftSpeed = 0.003;
      const angle = uniforms.time.value * driftSpeed;
      camera.position.set(20 * Math.sin(angle), 5 * Math.sin(angle * 0.4), 20 * Math.cos(angle));
      camera.lookAt(0, 0, 0);

      updateCameraUniforms();
      renderer.render(scene, camera);
    }

    renderer.init().then(() => {
      renderLoop();
    }).catch(err => {
      console.error('WebGPU initialization failed for SpaceBackground:', err);
      setWebgpuSupported(false);
    });

    const handleResize = () => {
      if (!rendererRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      uniforms.resolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (rendererRef.current) {
        if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }

      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none w-screen h-screen overflow-hidden select-none bg-black"
    >
      {/* Grid Overlay Mask */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj48cGF0aCBkPSJNMzAgMEgwVjMwSDMwVjBaTTEgMjlIMSBMMSAxaDI4djI4SDFaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDA1Ii8+PC9zdmc+')] pointer-events-none z-[1]" />

      {/* Cinematic Vignette Backdrop Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none z-[1]" />

      {!webgpuSupported && (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  );
}
