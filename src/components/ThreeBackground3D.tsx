import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ThreeBackground3DProps {
  isDark: boolean;
}

const _camPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _dummy = new THREE.Object3D();

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
        alpha: false,
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const darkBg = new THREE.Color('#070d1a');
    const lightBg = new THREE.Color('#e3f2fd');
    scene.background = isDarkRef.current ? darkBg.clone() : lightBg.clone();
    scene.fog = new THREE.FogExp2(isDarkRef.current ? 0x070d1a : 0xe3f2fd, 0.017);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 200);
    camera.position.set(0, 5.5, 22);

    // Procedural Studio Reflections (RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    // Warm/Cool 3-Point Lighting Rig
    const hemi = new THREE.HemisphereLight(0x90caf9, 0x0f172a, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.8);
    keyLight.position.set(18, 28, 20);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x42a5f5, 1.15);
    rimLight.position.set(-20, 12, -30);
    scene.add(rimLight);

    // Calibrated PBR Materials
    const terrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0f172a'),
      roughness: 0.78,
      metalness: 0.14,
      flatShading: true,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#42a5f5'),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const stoneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e293b'),
      roughness: 0.58,
      metalness: 0.16,
    });

    const steelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#cbd5e1'),
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.4,
    });

    const cobaltGlowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#42a5f5'),
      emissive: new THREE.Color('#1e88e5'),
      emissiveIntensity: 1.25,
      roughness: 0.25,
      metalness: 0.25,
    });

    const amberMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ff9800'),
      emissive: new THREE.Color('#f59e0b'),
      emissiveIntensity: 0.55,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.8,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#90caf9'),
      metalness: 0.0,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.85,
      ior: 1.52,
      thickness: 0.6,
      depthWrite: false,
    });

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Contoured 3D Digital Terrain extending into Horizon Fog
    const terrainGeo = new THREE.PlaneGeometry(180, 180, 56, 56);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Keep central flight valley clear & gentle hills on flanks
      const valleyFactor = Math.min(1, Math.abs(x) / 14);
      const h =
        (Math.sin(x * 0.14) * Math.cos(z * 0.12) * 3.8 +
          Math.sin((x + z) * 0.08) * 2.2) *
        valleyFactor;
      posAttr.setY(i, h - 1.2);
    }
    terrainGeo.computeVertexNormals();

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    worldGroup.add(terrainMesh);

    const terrainWire = new THREE.Mesh(terrainGeo, wireMat);
    terrainWire.position.y = 0.03;
    worldGroup.add(terrainWire);

    // 2. Winding 3D Flight Path & Glowing Data Rails (z = +26 to -86)
    const flightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4.8, 22),
      new THREE.Vector3(-4.5, 5.2, 4),
      new THREE.Vector3(4.5, 5.6, -16),
      new THREE.Vector3(-4.0, 5.4, -36),
      new THREE.Vector3(4.2, 5.8, -56),
      new THREE.Vector3(0, 6.2, -76),
    ]);

    const skyRailLeftPts = flightCurve
      .getPoints(60)
      .map((p) => new THREE.Vector3(p.x - 5.5, 0.25, p.z));
    const skyRailRightPts = flightCurve
      .getPoints(60)
      .map((p) => new THREE.Vector3(p.x + 5.5, 0.25, p.z));

    const railLeftGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(skyRailLeftPts),
      64,
      0.08,
      8,
      false
    );
    const railRightGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(skyRailRightPts),
      64,
      0.08,
      8,
      false
    );
    worldGroup.add(new THREE.Mesh(railLeftGeo, cobaltGlowMat));
    worldGroup.add(new THREE.Mesh(railRightGeo, cobaltGlowMat));

    // 3. Multi-Part 3D Landmark Monuments & Arches along the 3D World
    const spinningCores: THREE.Object3D[] = [];
    const monumentPositions: [number, number, number][] = [
      [-9.5, 0, 10],
      [9.5, 0, 2],
      [-10.5, 0, -12],
      [10.0, 0, -26],
      [-9.8, 0, -44],
      [9.5, 0, -60],
      [0, 0, -82],
    ];

    monumentPositions.forEach(([mx, my, mz], idx) => {
      const mon = new THREE.Group();
      mon.position.set(mx, my, mz);

      // Stepped Octagonal Pedestal (Part 1 & 2)
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(2.3, 2.7, 0.7, 8),
        stoneMat
      );
      base.position.y = 0.35;
      mon.add(base);

      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 2.0, 0.45, 8),
        steelMat
      );
      collar.position.y = 0.92;
      mon.add(collar);

      // Glowing Rim Ring (Part 3)
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(1.9, 0.055, 10, 32),
        cobaltGlowMat
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 1.18;
      mon.add(rim);

      // Glass Shield Cylinder (Part 4)
      const shield = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.4, 2.4, 8, 1, true),
        glassMat
      );
      shield.position.y = 2.4;
      mon.add(shield);

      // Floating Kinetic Core + Twin Gyroscopes (Parts 5, 6, 7)
      const coreGrp = new THREE.Group();
      coreGrp.position.y = 3.1;
      const coreGeo =
        idx % 3 === 0
          ? new THREE.OctahedronGeometry(0.95, 0)
          : idx % 3 === 1
          ? new THREE.IcosahedronGeometry(0.9, 0)
          : new THREE.DodecahedronGeometry(0.88, 0);
      const core = new THREE.Mesh(coreGeo, idx % 2 === 0 ? cobaltGlowMat : amberMat);
      coreGrp.add(core);

      const gyro1 = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.05, 10, 36),
        amberMat
      );
      gyro1.rotation.x = Math.PI / 3;
      coreGrp.add(gyro1);

      const gyro2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.65, 0.04, 10, 36),
        steelMat
      );
      gyro2.rotation.y = Math.PI / 4;
      coreGrp.add(gyro2);

      mon.add(coreGrp);
      spinningCores.push(coreGrp);
      worldGroup.add(mon);
    });

    // Overhead Architectural Sky-Arches spanning the 3D World Path
    const archZs = [8, -14, -36, -58];
    archZs.forEach((az) => {
      const arch = new THREE.Group();
      arch.position.set(0, 0, az);

      const torusArch = new THREE.Mesh(
        new THREE.TorusGeometry(9.5, 0.22, 12, 48, Math.PI),
        steelMat
      );
      arch.add(torusArch);

      const glowArch = new THREE.Mesh(
        new THREE.TorusGeometry(9.1, 0.07, 10, 48, Math.PI),
        cobaltGlowMat
      );
      arch.add(glowArch);

      worldGroup.add(arch);
    });

    // 4. Instanced Horizon Obelisks & Floating Crystal Nodes
    const obeliskCount = 48;
    const obeliskGeo = new THREE.CylinderGeometry(0.45, 0.9, 12, 6);
    const obeliskInst = new THREE.InstancedMesh(obeliskGeo, stoneMat, obeliskCount);
    for (let i = 0; i < obeliskCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (16 + ((i * 7) % 24));
      const z = 24 - i * 2.4;
      const sy = 0.6 + ((i * 11) % 10) * 0.12;
      _dummy.position.set(x, (12 * sy) / 2 - 1, z);
      _dummy.rotation.y = i * 0.4;
      _dummy.scale.set(1, sy, 1);
      _dummy.updateMatrix();
      obeliskInst.setMatrixAt(i, _dummy.matrix);
    }
    obeliskInst.instanceMatrix.needsUpdate = true;
    obeliskInst.computeBoundingSphere();
    worldGroup.add(obeliskInst);

    const crystalCount = 160;
    const crystalGeo = new THREE.OctahedronGeometry(0.22, 0);
    const crystalInst = new THREE.InstancedMesh(
      crystalGeo,
      cobaltGlowMat,
      crystalCount
    );
    const crystalSeeds: { x: number; y: number; z: number; s: number; sp: number }[] = [];
    for (let i = 0; i < crystalCount; i++) {
      const x = ((i * 31) % 48) - 24;
      const y = 1.5 + ((i * 17) % 14);
      const z = 24 - ((i * 13) % 108);
      const s = 0.55 + (i % 4) * 0.25;
      const sp = 0.35 + (i % 5) * 0.12;
      crystalSeeds.push({ x, y, z, s, sp });
      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(s);
      _dummy.updateMatrix();
      crystalInst.setMatrixAt(i, _dummy.matrix);
    }
    crystalInst.instanceMatrix.needsUpdate = true;
    crystalInst.frustumCulled = false;
    worldGroup.add(crystalInst);

    function applyTheme(dark: boolean) {
      const bg = dark ? darkBg : lightBg;
      (scene.background as THREE.Color).copy(bg);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(bg);
        scene.fog.density = dark ? 0.017 : 0.013;
      }
      terrainMat.color.set(dark ? '#0f172a' : '#cfe2fb');
      stoneMat.color.set(dark ? '#1e293b' : '#cbd5e1');
      wireMat.opacity = dark ? 0.24 : 0.28;
      cobaltGlowMat.emissiveIntensity = dark ? 1.25 : 0.7;
      hemi.intensity = dark ? 0.85 : 1.15;
    }
    themeUpdateRef.current = applyTheme;
    applyTheme(isDarkRef.current);

    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
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
    let smoothScroll = 0;

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

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const targetScroll = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
      smoothScroll = THREE.MathUtils.damp(smoothScroll, targetScroll, 5, dt);

      // Camera flies smoothly along the 3D World Spline as user scrolls
      const u = THREE.MathUtils.clamp(smoothScroll * 0.92, 0, 0.92);
      const uLook = THREE.MathUtils.clamp(u + 0.08, 0.05, 1.0);
      flightCurve.getPointAt(u, _camPos);
      flightCurve.getPointAt(uLook, _lookTarget);

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        _camPos.x + mouseX * 1.9,
        5,
        dt
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        _camPos.y - mouseY * 0.9,
        5,
        dt
      );
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camPos.z, 5, dt);
      camera.lookAt(_lookTarget.x * 0.8, _lookTarget.y - 1.2, _lookTarget.z - 8);

      for (let i = 0; i < spinningCores.length; i++) {
        const grp = spinningCores[i];
        grp.rotation.y = elapsed * (0.5 + i * 0.07);
        grp.rotation.x = Math.sin(elapsed * 0.7 + i) * 0.22;
        grp.position.y = 3.1 + Math.sin(elapsed * 1.3 + i) * 0.28;
      }

      for (let i = 0; i < crystalCount; i++) {
        const c = crystalSeeds[i];
        _dummy.position.set(
          c.x + Math.sin(elapsed * c.sp + i) * 0.35,
          c.y + Math.cos(elapsed * c.sp + i) * 0.4,
          c.z
        );
        _dummy.rotation.set(elapsed * c.sp, elapsed * c.sp * 1.3, 0);
        _dummy.scale.setScalar(c.s);
        _dummy.updateMatrix();
        crystalInst.setMatrixAt(i, _dummy.matrix);
      }
      crystalInst.instanceMatrix.needsUpdate = true;

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
      terrainGeo.dispose();
      railLeftGeo.dispose();
      railRightGeo.dispose();
      obeliskGeo.dispose();
      crystalGeo.dispose();
      terrainMat.dispose();
      wireMat.dispose();
      stoneMat.dispose();
      steelMat.dispose();
      cobaltGlowMat.dispose();
      amberMat.dispose();
      glassMat.dispose();
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
