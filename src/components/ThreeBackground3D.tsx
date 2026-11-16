import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ThreeBackground3DProps {
  isDark: boolean;
}

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const ThreeBackground3D: React.FC<ThreeBackground3DProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const themeUpdateRef = useRef<((dark: boolean) => void) | null>(null);

  useEffect(() => {
    themeUpdateRef.current?.(isDark);
  }, [isDark]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = window.innerWidth;
    const height = window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 180);
    camera.position.set(0, 1.5, 16);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0x90caf9, 0x0f172a, 0.8);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.7);
    keyLight.position.set(12, 18, 16);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x42a5f5, 1.1);
    rimLight.position.set(-14, -8, -12);
    scene.add(rimLight);

    const fogColorDark = new THREE.Color('#091020');
    const fogColorLight = new THREE.Color('#e8f2fd');
    scene.fog = new THREE.FogExp2(isDarkRef.current ? 0x091020 : 0xe8f2fd, 0.022);

    // Materials
    const cobaltMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#42a5f5'),
      metalness: 0.78,
      roughness: 0.2,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.82,
    });

    const steelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#94a3b8'),
      metalness: 0.9,
      roughness: 0.22,
      transparent: true,
      opacity: 0.72,
    });

    const amberMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ff9800'),
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.78,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#64b5f6'),
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.34 : 0.7,
      ior: 1.5,
      thickness: 0.6,
      depthWrite: false,
    });

    // Build 5 Composite Multi-Part 3D Geometric Sculptures arranged across depth
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const clusters: { group: THREE.Group; basePos: [number, number, number]; speed: number }[] = [];

    const clusterCoords: [number, number, number, number][] = [
      [-9.5, 4.5, -5, 1.0],
      [10.2, 2.5, -8, 1.15],
      [-10.5, -5.5, -10, 0.95],
      [9.2, -6.5, -6, 0.9],
      [0, 6.2, -14, 1.3],
    ];

    clusterCoords.forEach(([cx, cy, cz, scale], idx) => {
      const grp = new THREE.Group();
      grp.position.set(cx, cy, cz);
      grp.scale.setScalar(scale);

      const coreGeo =
        idx % 3 === 0
          ? new THREE.OctahedronGeometry(1.15, 0)
          : idx % 3 === 1
          ? new THREE.IcosahedronGeometry(1.1, 0)
          : new THREE.DodecahedronGeometry(1.05, 0);
      const core = new THREE.Mesh(coreGeo, idx % 2 === 0 ? cobaltMat : glassMat);
      grp.add(core);

      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.06, 12, 48), steelMat);
      ring1.rotation.x = Math.PI / 3;
      grp.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.04, 10, 48), amberMat);
      ring2.rotation.y = Math.PI / 4;
      grp.add(ring2);

      const sat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), cobaltMat);
      sat.position.set(1.75, 0, 0);
      grp.add(sat);

      worldGroup.add(grp);
      clusters.push({ group: grp, basePos: [cx, cy, cz], speed: 0.35 + idx * 0.08 });
    });

    // Subtle 3D Perspective Grid Floor
    const gridHelper = new THREE.GridHelper(120, 48, 0x42a5f5, 0x334155);
    gridHelper.position.y = -11;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    scene.add(gridHelper);

    // Instanced 3D Polyhedral Particle Field
    const particleCount = 140;
    const partGeo = new THREE.OctahedronGeometry(0.16, 0);
    const partInst = new THREE.InstancedMesh(partGeo, cobaltMat, particleCount);
    const particleData: { x: number; y: number; z: number; s: number; sp: number }[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < particleCount; i++) {
      const x = ((i * 37) % 44) - 22;
      const y = ((i * 53) % 30) - 15;
      const z = -((i * 19) % 24) - 2;
      const s = 0.5 + (i % 5) * 0.25;
      const sp = 0.25 + (i % 4) * 0.15;
      particleData.push({ x, y, z, s, sp });
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      partInst.setMatrixAt(i, dummy.matrix);
    }
    partInst.instanceMatrix.needsUpdate = true;
    partInst.frustumCulled = false;
    worldGroup.add(partInst);

    function applyTheme(dark: boolean) {
      const c = dark ? fogColorDark : fogColorLight;
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(c);
      }
      cobaltMat.opacity = dark ? 0.84 : 0.55;
      steelMat.opacity = dark ? 0.72 : 0.45;
      (gridHelper.material as THREE.Material).opacity = dark ? 0.22 : 0.14;
      hemi.intensity = dark ? 0.75 : 1.1;
    }
    themeUpdateRef.current = applyTheme;
    applyTheme(isDarkRef.current);

    let targetMouseX = 0;
    let targetMouseY = 0;
    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = window.scrollY / maxScroll;

      // Smooth damped camera & world parallax from mouse + scroll
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetMouseX * 1.8, 4.5, dt);
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        1.5 - targetMouseY * 1.1 - scrollRatio * 4.5,
        4.5,
        dt
      );
      camera.lookAt(0, -scrollRatio * 3.5, -6);

      worldGroup.rotation.y = THREE.MathUtils.damp(
        worldGroup.rotation.y,
        scrollRatio * 0.45 + targetMouseX * 0.08,
        4,
        dt
      );

      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        c.group.rotation.x = elapsed * c.speed * 0.45;
        c.group.rotation.y = elapsed * c.speed * 0.65;
        c.group.position.y = c.basePos[1] + Math.sin(elapsed * 0.9 + i) * 0.55;
      }

      for (let i = 0; i < particleCount; i++) {
        const d = particleData[i];
        dummy.position.set(
          d.x + Math.sin(elapsed * d.sp + i) * 0.4,
          d.y + Math.cos(elapsed * d.sp + i) * 0.45,
          d.z
        );
        dummy.rotation.set(elapsed * d.sp, elapsed * d.sp * 1.2, 0);
        dummy.scale.setScalar(d.s);
        dummy.updateMatrix();
        partInst.setMatrixAt(i, dummy.matrix);
      }
      partInst.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      cobaltMat.dispose();
      steelMat.dispose();
      amberMat.dispose();
      glassMat.dispose();
      partGeo.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};
