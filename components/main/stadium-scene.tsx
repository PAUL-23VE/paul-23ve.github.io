"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
//  Fondo 3D de toda la página: un estadio de noche.
//  La cámara recorre la cancha al bajar por la página y un balón rueda delante.
//
//  Optimización:
//  · Se dibuja solo cuando hace falta (frameloop "demand"): mientras se hace scroll,
//    se mueve el mouse o la cámara/balón siguen acomodándose. Quieto = 0 trabajo de GPU.
//  · Sin luces en tiempo real: la luz de los reflectores está pintada en la textura
//    de la cancha y todo usa materiales sin iluminación (baratos).
//  · Sin superficies transparentes grandes (lo que más cuesta en pantalla completa).
//  · Resolución limitada a 1.25x aunque la pantalla tenga más.
// ─────────────────────────────────────────────────────────────

const NIGHT = "#0b131e";
const PITCH_W = 68; // metros (ancho)
const PITCH_L = 105; // metros (largo)
const MARGIN = 5; // césped fuera de las líneas
const BALL_R = 1.1;

// Progreso del scroll (0 arriba, 1 abajo) y posición del mouse (-1 a 1).
const input = { scroll: 0, mx: 0, my: 0 };

// Posiciones de las torres de reflectores (esquinas, fuera de la cancha)
const TOWERS: [number, number, number][] = [
  [-50, 30, -62],
  [50, 30, -62],
  [-50, 30, 62],
  [50, 30, 62],
];

/* ── Cancha: textura con franjas, líneas y la luz de los reflectores ya pintada ── */
function makePitchTexture(maxAnisotropy: number) {
  const px = 12; // píxeles por metro
  const W = (PITCH_W + MARGIN * 2) * px;
  const H = (PITCH_L + MARGIN * 2) * px;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Franjas de corte de césped a lo ancho
  const bands = 18;
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = i % 2 ? "#082f21" : "#0a3828";
    ctx.fillRect(0, (H / bands) * i, W, H / bands + 1);
  }

  // Charcos de luz de los cuatro reflectores (luz "horneada")
  ctx.globalCompositeOperation = "lighter";
  for (const [tx, , tz] of TOWERS) {
    const x = (tx * 0.25 + PITCH_W / 2 + MARGIN) * px;
    const y = (tz * 0.25 + PITCH_L / 2 + MARGIN) * px;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 46 * px);
    g.addColorStop(0, "rgba(110, 140, 105, 0.18)");
    g.addColorStop(1, "rgba(120, 150, 110, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = "source-over";

  // Líneas (en metros, con origen en la esquina de la cancha)
  ctx.setTransform(px, 0, 0, px, MARGIN * px, MARGIN * px);
  ctx.strokeStyle = "rgba(248,250,252,0.72)";
  ctx.fillStyle = "rgba(248,250,252,0.72)";
  ctx.lineWidth = 0.16;
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  const arc = (x: number, y: number, r: number, a1: number, a2: number) => {
    ctx.beginPath();
    ctx.arc(x, y, r, a1, a2);
    ctx.stroke();
  };
  const spot = (x: number, y: number, r = 0.3) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  const cx = PITCH_W / 2;
  ctx.strokeRect(0, 0, PITCH_W, PITCH_L);
  line(0, PITCH_L / 2, PITCH_W, PITCH_L / 2);
  arc(cx, PITCH_L / 2, 9.15, 0, Math.PI * 2);
  spot(cx, PITCH_L / 2);
  for (const end of [0, 1]) {
    const y0 = end ? PITCH_L : 0;
    const dir = end ? -1 : 1;
    const box = (w: number, d: number) => ctx.strokeRect(cx - w / 2, end ? y0 - d : y0, w, d);
    box(40.32, 16.5);
    box(18.32, 5.5);
    spot(cx, y0 + dir * 11);
    // Semicírculo del área: la parte del círculo de 9.15 m fuera del área grande
    const a = Math.acos((16.5 - 11) / 9.15);
    if (end) arc(cx, y0 - 11, 9.15, -Math.PI / 2 - a, -Math.PI / 2 + a);
    else arc(cx, y0 + 11, 9.15, Math.PI / 2 - a, Math.PI / 2 + a);
  }
  arc(0, 0, 1, 0, Math.PI / 2);
  arc(PITCH_W, 0, 1, Math.PI / 2, Math.PI);
  arc(0, PITCH_L, 1, -Math.PI / 2, 0);
  arc(PITCH_W, PITCH_L, 1, Math.PI, Math.PI * 1.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(4, maxAnisotropy);
  return tex;
}

function Pitch() {
  const gl = useThree((s) => s.gl);
  const texture = useMemo(() => makePitchTexture(gl.capabilities.getMaxAnisotropy()), [gl]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[PITCH_W + MARGIN * 2, PITCH_L + MARGIN * 2]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      {/* Pista alrededor de la cancha */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02}>
        <planeGeometry args={[220, 260]} />
        <meshBasicMaterial color="#0d1825" />
      </mesh>
    </group>
  );
}

/* ── Arcos (postes sólidos; la red son líneas, no una superficie transparente) ── */
function makeNetGeometry(w: number, h: number, d: number, step: number) {
  const pts: number[] = [];
  const seg = (a: number[], b: number[]) => pts.push(...a, ...b);
  for (let x = -w / 2; x <= w / 2 + 1e-6; x += step) {
    seg([x, h, 0], [x, h, d]); // techo
    seg([x, h, d], [x, 0, d]); // fondo
  }
  for (let y = 0; y <= h + 1e-6; y += step) seg([-w / 2, y, d], [w / 2, y, d]);
  for (let z = 0; z <= d + 1e-6; z += step) {
    seg([-w / 2, h, z], [w / 2, h, z]);
    seg([-w / 2, 0, z], [-w / 2, h, z]);
    seg([w / 2, 0, z], [w / 2, h, z]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

function Goal({ z, flip }: { z: number; flip?: boolean }) {
  const w = 7.32;
  const h = 2.44;
  const r = 0.08;
  const net = useMemo(() => makeNetGeometry(w, h, 2, 0.6), []);
  useEffect(() => () => net.dispose(), [net]);
  return (
    <group position={[0, 0, z]} rotation-y={flip ? Math.PI : 0}>
      {[-w / 2, w / 2].map((x) => (
        <mesh key={x} position={[x, h / 2, 0]}>
          <cylinderGeometry args={[r, r, h, 8]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
      ))}
      <mesh position={[0, h, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[r, r, w + r * 2, 8]} />
        <meshBasicMaterial color="#e2e8f0" />
      </mesh>
      <lineSegments geometry={net}>
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

/* ── Tribunas con público (puntos de color) ── */
function makeCrowd() {
  const pts: number[] = [];
  const colors: number[] = [];
  const palette = [
    [0.95, 0.96, 0.98],
    [0.06, 0.73, 0.51],
    [0.96, 0.62, 0.04],
    [0.45, 0.52, 0.62],
  ];
  const add = (x: number, y: number, z: number) => {
    pts.push(x, y, z);
    colors.push(...palette[Math.random() < 0.6 ? 3 : Math.floor(Math.random() * 3)]);
  };
  for (let i = 0; i < 1600; i++) {
    const t = Math.random();
    const row = Math.random();
    if (Math.random() < 0.62) {
      const sx = Math.random() < 0.5 ? -1 : 1;
      add(sx * (PITCH_W / 2 + 12 + row * 16), 1.5 + row * 11, (t - 0.5) * (PITCH_L + 20));
    } else {
      const sz = Math.random() < 0.5 ? -1 : 1;
      add((t - 0.5) * (PITCH_W + 30), 1.5 + row * 11, sz * (PITCH_L / 2 + 14 + row * 16));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return g;
}

function Stands() {
  const crowd = useMemo(() => makeCrowd(), []);
  useEffect(() => () => crowd.dispose(), [crowd]);
  const tilt = 0.6;
  return (
    <group>
      {[-1, 1].map((sx) => (
        <mesh key={`l${sx}`} position={[sx * (PITCH_W / 2 + 20), 6, 0]} rotation-z={sx * tilt}>
          <boxGeometry args={[1, 26, PITCH_L + 40]} />
          <meshBasicMaterial color="#111d2c" />
        </mesh>
      ))}
      {[-1, 1].map((sz) => (
        <mesh key={`f${sz}`} position={[0, 6, sz * (PITCH_L / 2 + 22)]} rotation-x={-sz * tilt}>
          <boxGeometry args={[PITCH_W + 50, 26, 1]} />
          <meshBasicMaterial color="#111d2c" />
        </mesh>
      ))}
      <points geometry={crowd}>
        <pointsMaterial size={0.34} vertexColors sizeAttenuation />
      </points>
    </group>
  );
}

/* ── Torres de reflectores: poste, panel y un halo pequeño ── */
function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,247,225,1)");
  grad.addColorStop(0.2, "rgba(255,240,205,0.6)");
  grad.addColorStop(0.55, "rgba(255,230,180,0.12)");
  grad.addColorStop(1, "rgba(255,230,180,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function Towers() {
  const glow = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);
  return (
    <group>
      {TOWERS.map(([x, y, z]) => (
        <group key={`${x}${z}`}>
          <mesh position={[x, y / 2, z]}>
            <cylinderGeometry args={[0.35, 0.6, y, 6]} />
            <meshBasicMaterial color="#1b2b40" />
          </mesh>
          <mesh position={[x, y, z]} rotation-y={Math.atan2(x, z)}>
            <boxGeometry args={[6, 3, 0.6]} />
            <meshBasicMaterial color="#fff6dd" toneMapped={false} />
          </mesh>
          <sprite position={[x, y, z]} scale={[16, 16, 1]}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
          </sprite>
        </group>
      ))}
    </group>
  );
}

/* ── Balón: truncated icosahedron dibujado en el shader ── */
// Los 12 pentágonos están en los vértices de un icosaedro y los 20 hexágonos en los
// centros de sus caras. Cada punto de la esfera toma el color de la cara más cercana;
// donde dos caras quedan casi a la misma distancia se dibuja la costura.
function ballSites() {
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const pos = ico.getAttribute("position");
  const verts: THREE.Vector3[] = [];
  const centers: THREE.Vector3[] = [];
  for (let f = 0; f < pos.count; f += 3) {
    const c = new THREE.Vector3();
    for (let k = 0; k < 3; k++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, f + k);
      c.add(v);
      const n = v.clone().normalize();
      if (!verts.some((u) => u.distanceTo(n) < 1e-4)) verts.push(n);
    }
    centers.push(c.normalize());
  }
  ico.dispose();
  return [...verts, ...centers]; // 12 + 20
}

export const ballMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: {
      uSites: { value: ballSites() },
      uLight: { value: new THREE.Vector3(0.35, 1, 0.45).normalize() },
      uRim: { value: new THREE.Color("#10b981") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObj; varying vec3 vN; varying vec3 vView;
      void main() {
        vObj = normal;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSites[32]; uniform vec3 uLight; uniform vec3 uRim;
      varying vec3 vObj; varying vec3 vN; varying vec3 vView;
      void main() {
        vec3 n = normalize(vObj);
        float best = -2.0; float second = -2.0; int idx = 0;
        for (int i = 0; i < 32; i++) {
          float d = dot(n, uSites[i]);
          if (d > best) { second = best; best = d; idx = i; }
          else if (d > second) { second = d; }
        }
        float seam = smoothstep(0.004, 0.02, best - second);
        vec3 base = idx < 12 ? vec3(0.05, 0.08, 0.12) : vec3(0.96, 0.97, 0.98);
        base *= mix(0.35, 1.0, seam);

        vec3 N = normalize(vN); vec3 V = normalize(vView);
        float diff = max(dot(N, uLight), 0.0);
        float spec = pow(max(dot(N, normalize(uLight + V)), 0.0), 48.0) * 0.55;
        float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        gl_FragColor = vec4(base * (0.22 + 0.85 * diff) + spec + uRim * rim * 0.55, 1.0);
        #include <colorspace_fragment>
      }`,
  });

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(0,0,0,0.6)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// Dónde debería estar el balón según el scroll: avanza de un área a la otra
// haciendo zigzag por los costados (no por el centro, donde está el texto).
const ballGoal = (p: number, out: THREE.Vector3) => {
  const side = Math.sin(p * Math.PI * 5);
  const x = Math.sign(side || 1) * (11 + Math.abs(side) * 6);
  return out.set(x, BALL_R, THREE.MathUtils.lerp(40, -44, p));
};

/* ── Cámara + balón: se mueven suavemente hacia su destino y piden cuadros
      solo mientras no han llegado ── */
function Rig() {
  const invalidate = useThree((s) => s.invalidate);
  const ball = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const material = useMemo(() => ballMaterial(), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const tmp = useMemo(
    () => ({
      camGoal: new THREE.Vector3(),
      look: new THREE.Vector3(0, 0, 28),
      lookGoal: new THREE.Vector3(),
      ballGoal: new THREE.Vector3(),
      last: new THREE.Vector3(0, BALL_R, 40),
      axis: new THREE.Vector3(),
      q: new THREE.Quaternion(),
    }),
    [],
  );
  useEffect(
    () => () => {
      material.dispose();
      shadowTex.dispose();
    },
    [material, shadowTex],
  );

  // Cada scroll / movimiento del mouse pide un cuadro nuevo
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      input.scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      invalidate();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      input.mx = (e.clientX / window.innerWidth) * 2 - 1;
      input.my = (e.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [invalidate]);

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05); // evita saltos tras una pausa
    const k = 1 - Math.exp(-delta * 4);
    const p = input.scroll;

    // Cámara
    tmp.camGoal.set(
      THREE.MathUtils.lerp(-6, 6, p) + input.mx * 2.5,
      THREE.MathUtils.lerp(10, 17, Math.sin(p * Math.PI)) - input.my * 1.2,
      THREE.MathUtils.lerp(62, -14, p),
    );
    camera.position.lerp(tmp.camGoal, k);
    tmp.lookGoal.set(input.mx * 3, 0, camera.position.z - 34);
    tmp.look.lerp(tmp.lookGoal, k);
    camera.lookAt(tmp.look);

    // Balón: rueda según la distancia recorrida en el suelo
    const mesh = ball.current;
    if (mesh) {
      mesh.position.lerp(ballGoal(p, tmp.ballGoal), k);
      const dx = mesh.position.x - tmp.last.x;
      const dz = mesh.position.z - tmp.last.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 1e-5) {
        tmp.axis.set(dz, 0, -dx).normalize();
        tmp.q.setFromAxisAngle(tmp.axis, dist / BALL_R);
        mesh.quaternion.premultiply(tmp.q);
      }
      tmp.last.copy(mesh.position);
      shadow.current?.position.set(mesh.position.x, 0.03, mesh.position.z);
    }

    // ¿Falta llegar? Entonces se pide otro cuadro; si no, la escena queda quieta.
    const moving =
      camera.position.distanceToSquared(tmp.camGoal) > 1e-4 ||
      tmp.look.distanceToSquared(tmp.lookGoal) > 1e-4 ||
      (mesh ? mesh.position.distanceToSquared(tmp.ballGoal) > 1e-4 : false);
    if (moving) invalidate();
  });

  return (
    <>
      <mesh ref={ball} material={material} position={[0, BALL_R, 40]}>
        <sphereGeometry args={[BALL_R, 40, 28]} />
      </mesh>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} position={[0, 0.03, 40]}>
        <planeGeometry args={[BALL_R * 3, BALL_R * 3]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

/* Cielo con estrellas sobre el estadio */
function makeSky() {
  const n = 700;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * 0.5 * Math.PI; // solo hemisferio superior
    const r = 260;
    arr[i * 3] = Math.cos(u) * Math.cos(v) * r;
    arr[i * 3 + 1] = Math.sin(v) * r + 20;
    arr[i * 3 + 2] = Math.sin(u) * Math.cos(v) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return g;
}

function Sky() {
  const geometry = useMemo(() => makeSky(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points geometry={geometry}>
      <pointsMaterial size={1.1} color="#cbd5e1" sizeAttenuation fog={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={[NIGHT]} />
      <fog attach="fog" args={[NIGHT, 45, 150]} />
      <Sky />
      <Pitch />
      <Goal z={-PITCH_L / 2} flip />
      <Goal z={PITCH_L / 2} />
      <Stands />
      <Towers />
      <Rig />
    </>
  );
}

export const StadiumScene = () => (
  <div className="stadium-bg" aria-hidden="true">
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 10, 62], fov: 50, near: 0.5, far: 600 }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
    {/* Velo para que el texto siempre se lea sobre la escena */}
    <div className="stadium-bg__veil" />
  </div>
);
