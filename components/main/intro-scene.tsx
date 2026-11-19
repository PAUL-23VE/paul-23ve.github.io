"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { usePlayer, type PlayerRig } from "@/components/main/intro-player";
import { ballMaterial } from "@/components/main/stadium-scene";

// ─────────────────────────────────────────────────────────────
//  Escena 3D de la intro, estilo videojuego. Guion (segundos):
//   0.0  se encienden el foco y los reflectores; el jugador entra en esprint con el balón
//   1.25 baja a trote, frena y se gira hacia la cámara
//   2.9  truco: levanta el balón y lo domina con el pie, la rodilla y el pie
//   5.0  volea a la cámara (la pierna se anima rotando sus huesos)
//   5.35 el balón llega a la cámara (IMPACT): destello y aparece el nombre
//   5.65 salta celebrando y después baila mientras espera a que el usuario entre
//  Unidades: metros. El jugador corre hacia +X y termina en x = 0.
// ─────────────────────────────────────────────────────────────

const NIGHT = "#0b131e";
const R = 0.11; // radio del balón
const SPEED = 5.5; // m/s en esprint
const RUN_END = 1.25; // empieza a frenar
const STOP_T = 2.3; // queda quieto
// Truco: levanta el balón con el pie, toque de pie, de rodilla, de pie y volea a la cámara
const LIFT = 2.95; // el pie levanta el balón del suelo
const TOUCHES: [number, number][] = [
  [LIFT, 0.15], // [tiempo, altura del centro del balón al tocarlo]
  [3.45, 0.32], // empeine
  [4.0, 0.62], // rodilla
  [4.55, 0.32], // empeine (lo deja alto para la volea)
];
const KICK = 5.0; // volea
const KICK_Y = 0.5;
export const IMPACT = 5.35;
const JUMP = 5.65;
const G = 9.8;
// Altura del balón en un tiro parabólico entre dos toques (gravedad real)
const arc = (t: number, t0: number, y0: number, t1: number, y1: number) => {
  const T = t1 - t0;
  const u = t - t0;
  const v0 = (y1 - y0 + 0.5 * G * T * T) / T;
  return y0 + v0 * u - 0.5 * G * u * u;
};
const ballHeight = (t: number) => {
  const pts: [number, number][] = [...TOUCHES, [KICK, KICK_Y]];
  for (let i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) return arc(t, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  return KICK_Y;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
// Curva continua por varias claves [tiempo, valor]: la velocidad no se detiene en cada clave
// (Hermite cúbica con tangentes de Catmull-Rom, algo suavizadas para no pasarse).
const curve = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  const n = k.length - 1;
  if (t >= k[n][0]) return k[n][1];
  let i = 0;
  while (t > k[i + 1][0]) i++;
  const [t0, p0] = k[i];
  const [t1, p1] = k[i + 1];
  const h = t1 - t0;
  const slope = (a: number, b: number) => (k[b][1] - k[a][1]) / (k[b][0] - k[a][0]);
  const m0 = i > 0 ? 0.8 * slope(i - 1, i + 1) : 0;
  const m1 = i + 1 < n ? 0.8 * slope(i, i + 2) : 0;
  const u = (t - t0) / h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * h * m1;
};
// Pulso suave alrededor de un instante (para amortiguar cada toque)
const pulse = (t: number, at: number, w: number) => Math.exp(-(((t - at) / w) ** 2));

// Velocidad y distancia recorrida (frena con una curva suave hasta STOP_T)
const BRAKE = STOP_T - RUN_END;
const speedAt = (t: number) => (t < RUN_END ? SPEED : SPEED * (1 - smooth((t - RUN_END) / BRAKE)));
const distAt = (t: number) => {
  if (t < RUN_END) return SPEED * t;
  const u = clamp((t - RUN_END) / BRAKE);
  return SPEED * RUN_END + SPEED * BRAKE * (u - u * u * u + (u * u * u * u) / 2);
};
const START_X = -distAt(STOP_T);

// Puntos de cámara: seguimiento lateral, plano bajo para el disparo y plano para el nombre
const KICK_CAM = new THREE.Vector3(3.9, 0.85, 3.9);
const TITLE_CAM = new THREE.Vector3(3.5, 1.35, 4.3);
const FACE_YAW = Math.atan2(KICK_CAM.x, KICK_CAM.z); // de frente a la cámara del disparo

/* ── Texturas del escenario ── */
function makeGrassTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? "#0b3d2b" : "#0e4a34";
    g.fillRect((512 / 8) * i, 0, 512 / 8 + 1, 512);
  }
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = Math.random() < 0.5 ? "rgba(0,0,0,0.12)" : "rgba(120,200,150,0.06)";
    g.fillRect(Math.random() * 512, Math.random() * 512, 1, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  tex.anisotropy = 4;
  return tex;
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,247,225,1)");
  grad.addColorStop(0.25, "rgba(255,240,205,0.45)");
  grad.addColorStop(1, "rgba(255,230,180,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// Polvo flotando dentro del haz del foco
function makeDust() {
  const n = 260;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = Math.random() * 4.5;
    const r = Math.random() * (0.4 + y * 0.28);
    const a = Math.random() * Math.PI * 2;
    arr[i * 3] = Math.cos(a) * r;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = Math.sin(a) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return g;
}

// Flashes de fotógrafos en las tribunas (posición, ritmo y desfase al azar)
function makeFlashes() {
  return Array.from({ length: 18 }, () => ({
    pos: [(Math.random() - 0.5) * 22, 0.6 + Math.random() * 2.4, -9 - Math.random() * 5] as [number, number, number],
    rate: 0.5 + Math.random() * 0.9,
    phase: Math.random(),
  }));
}

// Cabezas de las torres de reflectores (se encienden en secuencia)
const LIGHTS: [number, number, number][] = [
  [-15, 9.5, -17],
  [-6, 11, -24],
  [6, 11, -24],
  [15, 9.5, -17],
];

// Posición del mouse (-1 a 1) suavizada: mueve la cámara en relieve y la mirada del jugador
const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

/* ── Estadio de fondo ── */
// Público en una tribuna inclinada: puntos de colores (camisetas) sobre gradas oscuras
function makeCrowd() {
  const pts: number[] = [];
  const colors: number[] = [];
  const palette = [
    [0.06, 0.73, 0.51],
    [0.96, 0.62, 0.04],
    [0.95, 0.96, 0.98],
    [0.55, 0.62, 0.72],
  ];
  for (let i = 0; i < 4200; i++) {
    const row = Math.random();
    const x = (Math.random() - 0.5) * 46;
    pts.push(x, 1.5 + row * 7.2, -18.9 - row * 5.8);
    colors.push(...palette[Math.floor(Math.random() * palette.length)]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return g;
}

// Red del arco como líneas (barata y nítida)
function makeNet(w: number, h: number, d: number, step: number) {
  const pts: number[] = [];
  const seg = (a: number[], b: number[]) => pts.push(...a, ...b);
  for (let x = -w / 2; x <= w / 2 + 1e-6; x += step) {
    seg([x, h, 0], [x, h * 0.85, -d]);
    seg([x, h * 0.85, -d], [x, 0, -d]);
  }
  for (let y = 0; y <= h + 1e-6; y += step) seg([-w / 2, y, -d], [w / 2, y, -d]);
  for (let z = 0; z <= d + 1e-6; z += step) {
    const y = h - (h * 0.15 * z) / d;
    seg([-w / 2, y, -z], [w / 2, y, -z]);
    seg([-w / 2, 0, -z], [-w / 2, y, -z]);
    seg([w / 2, 0, -z], [w / 2, y, -z]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

// Confeti del festejo: posición inicial, velocidad, giro y color de cada papel
const CONFETTI = 260;
function makeConfetti() {
  const colors = ["#10b981", "#34d399", "#f59e0b", "#fbbf24", "#f8fafc"];
  return Array.from({ length: CONFETTI }, () => {
    const side = Math.random() < 0.5 ? -1 : 1;
    return {
      p: new THREE.Vector3(side * (1.2 + Math.random() * 1.5), 0.2, (Math.random() - 0.5) * 2),
      v: new THREE.Vector3(-side * (0.6 + Math.random() * 1.6), 5 + Math.random() * 3.5, (Math.random() - 0.3) * 2),
      spin: new THREE.Vector3(Math.random() * 9, Math.random() * 9, Math.random() * 9),
      delay: Math.random() * 0.35,
      color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
    };
  });
}

// Rota un hueso alrededor de un eje en coordenadas del mundo (sobre la pose de la animación)
const tmpQ = new THREE.Quaternion();
const tmpP = new THREE.Quaternion();
function rotateBoneWorld(bone: THREE.Bone | undefined, axis: THREE.Vector3, angle: number) {
  if (!bone?.parent || Math.abs(angle) < 1e-4) return;
  bone.parent.getWorldQuaternion(tmpP);
  tmpQ.setFromAxisAngle(axis, angle);
  // rotación expresada en el espacio del padre: P⁻¹ · Q · P
  const local = tmpP.clone().invert().multiply(tmpQ).multiply(tmpP);
  bone.quaternion.premultiply(local);
  bone.updateMatrixWorld(true);
}

type Cb = { onStart: () => void; onReady: () => void; onImpact: () => void };

function Game({ onStart, onReady, onImpact }: Cb) {
  const rig: PlayerRig = usePlayer();
  const player = useRef<THREE.Group>(null);
  const ball = useRef<THREE.Mesh>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const dust = useRef<THREE.Points>(null);
  const lights = useRef<(THREE.Sprite | null)[]>([]);
  const flashes = useRef<(THREE.Sprite | null)[]>([]);
  const state = useRef({ start: -1, ready: false, impact: false, sprint: 0, jog: 0, idle: 0, dance: 0, last: 0 });
  const framed = useRef("");
  const tmp = useMemo(
    () => ({
      cam: new THREE.Vector3(),
      look: new THREE.Vector3(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      side: new THREE.Vector3(),
      fwd: new THREE.Vector3(),
      kickFrom: new THREE.Vector3(),
      aim: new THREE.Vector3(),
    }),
    [],
  );
  const flashData = useMemo(() => makeFlashes(), []);
  const confettiData = useMemo(() => makeConfetti(), []);
  const confetti = useRef<THREE.InstancedMesh>(null);
  const trail = useRef<(THREE.Sprite | null)[]>([]);
  const trailPos = useMemo(() => Array.from({ length: 8 }, () => new THREE.Vector3()), []);
  const flag = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const ballMat = useMemo(() => ballMaterial(), []);
  const dustGeo = useMemo(() => makeDust(), []);
  const glow = useMemo(() => makeGlowTexture(), []);
  useEffect(
    () => () => {
      ballMat.dispose();
      dustGeo.dispose();
      glow.dispose();
    },
    [ballMat, dustGeo, glow],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useEffect(() => {
    const mesh = confetti.current;
    if (!mesh) return;
    confettiData.forEach((c, i) => mesh.setColorAt(i, c.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [confettiData]);

  useFrame((three, rawDelta) => {
    const { camera, size } = three;
    const key = `${size.width}x${size.height}`;
    if (framed.current !== key && camera instanceof THREE.PerspectiveCamera) {
      framed.current = key;
      camera.fov = size.width / size.height < 1 ? 50 : 32;
      // El jugador queda un poco por encima del centro (el nombre va abajo)
      camera.setViewOffset(size.width, size.height, 0, size.height * 0.16, size.width, size.height);
      camera.updateProjectionMatrix();
    }

    const s = state.current;
    if (s.start < 0) {
      s.start = three.clock.elapsedTime;
      onStart();
    }
    const t = three.clock.elapsedTime - s.start;
    const dt = Math.min(rawDelta, 0.05);

    /* ── Jugador: posición y orientación ── */
    const px = START_X + distAt(Math.min(t, STOP_T));
    const v = speedAt(t);
    const turn = smooth(span(t, 1.9, 2.75));
    const yaw = lerp(Math.PI / 2, FACE_YAW, turn);
    player.current?.position.set(px, 0, 0);
    player.current?.rotation.set(0, yaw, 0);

    /* ── Animaciones: el guion fija tiempo y peso de cada una ── */
    const A = rig.actions;
    s.sprint += dt * Math.max(0.55, v / SPEED);
    s.jog += dt * Math.max(0.5, v / 3.2);
    s.idle += dt;
    if (t > JUMP + 2.5) s.dance += dt;
    const jumpS = t - JUMP;
    const w: Record<string, number> = {
      Sprint_Loop: 1 - smooth(span(t, RUN_END, RUN_END + 0.35)),
      Jog_Fwd_Loop: smooth(span(t, RUN_END, RUN_END + 0.35)) * (1 - smooth(span(t, 1.85, 2.35))),
      Idle_Loop: smooth(span(t, 1.85, 2.35)) * (1 - smooth(span(t, JUMP, JUMP + 0.15))),
      Jump_Start: smooth(span(t, JUMP, JUMP + 0.15)) * (1 - smooth(span(t, JUMP + 1.25, JUMP + 1.4))),
      Jump_Land: smooth(span(t, JUMP + 1.25, JUMP + 1.4)) * (1 - smooth(span(t, JUMP + 2.45, JUMP + 2.75))),
      Dance_Loop: smooth(span(t, JUMP + 2.45, JUMP + 2.75)),
    };
    const total = Object.values(w).reduce((x, y) => x + y, 0) || 1;
    const times: Record<string, number> = {
      Sprint_Loop: s.sprint,
      Jog_Fwd_Loop: s.jog,
      Idle_Loop: s.idle,
      Jump_Start: clamp(jumpS, 0, 1.32),
      Jump_Land: clamp(jumpS - 1.25, 0, 1.26),
      Dance_Loop: s.dance,
    };
    for (const [name, a] of Object.entries(A)) {
      const dur = a.getClip().duration;
      a.setEffectiveWeight((w[name] ?? 0) / total);
      const tt = times[name] ?? 0;
      a.time = name.endsWith("_Loop") ? tt % dur : Math.min(tt, dur - 1e-3);
    }
    rig.mixer.update(0);
    rig.root.updateMatrixWorld(true);

    /* ── Truco y volea: se suman a la pose de la animación base ── */
    // Ejes del jugador: lateral (ángulo + lleva la pierna atrás), frente y vertical
    tmp.side.set(Math.cos(yaw), 0, -Math.sin(yaw));
    tmp.fwd.set(Math.sin(yaw), 0, Math.cos(yaw));
    const juggle = smooth(span(t, 2.7, 2.95)) * (1 - smooth(span(t, 5.3, 5.9)));
    // Pierna hábil: [tiempo, muslo hacia delante, flexión de rodilla, punta del pie]
    // Entre toques el pie queda flotando, relajado y cerca del balón.
    const legKeys: [number, number, number, number][] = [
      [2.7, 0, 0, 0],
      [2.82, -0.18, 0.45, -0.2], // suela sobre el balón, la tira hacia atrás
      [LIFT, 0.5, 0.75, 0.35], // lo levanta con la punta
      [3.12, 0.22, 0.45, 0.12],
      [3.3, 0.16, 0.55, 0.08], // baja un poco para tomar impulso
      [3.45, 0.55, 0.72, 0.42], // empeine
      [3.62, 0.24, 0.5, 0.12],
      [3.82, 0.4, 0.95, 0.02], // prepara la rodilla
      [4.0, 1.3, 1.65, 0.25], // muslo
      [4.2, 0.5, 0.8, 0.1],
      [4.38, 0.18, 0.55, 0.1],
      [4.55, 0.55, 0.72, 0.42], // empeine, lo deja alto
      [4.72, 0.05, 0.95, 0.05],
      [4.86, -0.72, 1.55, 0.35], // carga la pierna
      [KICK, 0.95, 0.2, 0.6], // volea con el empeine
      [5.15, 1.3, 0.12, 0.5],
      [5.45, 0.45, 0.45, 0.1],
      [5.85, 0, 0, 0],
    ];
    const thigh = curve(t, legKeys.map(([k, v]) => [k, v] as [number, number]));
    const knee = Math.max(0, curve(t, legKeys.map(([k, , v]) => [k, v] as [number, number])));
    const toe = curve(t, legKeys.map(([k, , , v]) => [k, v] as [number, number]));
    const lean = curve(t, [
      [2.7, 0],
      [3.0, 0.1],
      [4.0, 0.14],
      [4.6, 0.08],
      [4.86, 0.16],
      [KICK, -0.16],
      [5.3, -0.08],
      [5.8, 0],
    ]);
    // Pierna de apoyo: rodillas blandas mientras domina y un amortiguado en cada toque
    const touches = [LIFT, 3.45, 4.0, 4.55, KICK];
    const dip = juggle * (0.1 + touches.reduce((acc, c) => acc + 0.12 * pulse(t, c + 0.05, 0.1), 0));
    player.current?.position.setY(-0.87 * (1 - Math.cos(dip)));
    rotateBoneWorld(rig.bones.thigh_l, tmp.side, -dip);
    rotateBoneWorld(rig.bones.calf_l, tmp.side, 2 * dip);
    rotateBoneWorld(rig.bones.foot_l, tmp.side, -dip);
    // Tronco y cadera: se inclinan sobre el balón y giran con la pierna
    rotateBoneWorld(rig.bones.spine_01, tmp.side, lean);
    rotateBoneWorld(rig.bones.spine_02, up, 0.12 * thigh * juggle);
    // Brazos abiertos para equilibrar, con un vaivén contrario a la pierna
    const arms = juggle * (0.5 + 0.12 * Math.sin(t * 7.5)) + 0.3 * pulse(t, KICK, 0.12);
    rotateBoneWorld(rig.bones.upperarm_l, tmp.fwd, arms);
    rotateBoneWorld(rig.bones.upperarm_r, tmp.fwd, -arms);
    rotateBoneWorld(rig.bones.upperarm_l, tmp.side, -0.25 * thigh * juggle);
    rotateBoneWorld(rig.bones.upperarm_r, tmp.side, 0.15 * thigh * juggle);
    // Pierna hábil
    rotateBoneWorld(rig.bones.thigh_r, tmp.side, -thigh);
    rotateBoneWorld(rig.bones.calf_r, tmp.side, knee);
    rotateBoneWorld(rig.bones.foot_r, tmp.side, toe);
    // La cabeza sigue la altura del balón
    const ballY = t > LIFT && t < KICK ? ballHeight(t) : R;
    const look = juggle * (0.5 - 0.35 * clamp((ballY - 0.1) / 0.6));
    rotateBoneWorld(rig.bones.neck_01, tmp.side, look);

    /* ── Mouse: suavizado; tras el disparo el jugador sigue el cursor con la mirada ── */
    const follow = 1 - Math.exp(-dt * 4);
    pointer.sx += (pointer.x - pointer.sx) * follow;
    pointer.sy += (pointer.y - pointer.sy) * follow;
    const watch = smooth(span(t, IMPACT + 0.4, IMPACT + 1.4));
    rotateBoneWorld(rig.bones.neck_01, up, -0.55 * pointer.sx * watch);
    rotateBoneWorld(rig.bones.Head, tmp.side, 0.3 * pointer.sy * watch);

    /* ── Balón ── */
    const b = ball.current;
    if (b) {
      // Delante del pie derecho del jugador (según hacia dónde mira)
      const run = 1 - turn;
      tmp.a.set(px + 0.62 + Math.max(0, Math.sin(t * 9)) * 0.08 * (v / SPEED), R, 0.05);
      const reach = curve(t, [
        [LIFT, 0.38],
        [3.45, 0.36],
        [4.0, 0.27],
        [4.55, 0.36],
        [KICK, 0.42],
      ]);
      const drift = 0.025 * Math.sin((t - LIFT) * 4.2) * juggle;
      tmp.b.set(
        px + Math.sin(yaw) * reach - Math.cos(yaw) * (0.1 + drift),
        R,
        Math.cos(yaw) * reach + Math.sin(yaw) * (0.1 + drift),
      );
      if (t < LIFT) {
        b.visible = true;
        b.position.lerpVectors(tmp.b, tmp.a, run);
        b.rotation.set(0, 0, -(px + 0.62) / R);
      } else if (t < KICK) {
        b.position.set(tmp.b.x, ballHeight(t), tmp.b.z);
        // Efecto hacia atrás, más fuerte justo después de cada toque
        const spin = 6 + touches.reduce((acc, c) => acc + 10 * pulse(t, c + 0.08, 0.12), 0);
        b.rotateOnWorldAxis(tmp.side, -dt * spin);
        tmp.kickFrom.copy(b.position);
      } else if (t < IMPACT) {
        const k = Math.pow(span(t, KICK, IMPACT), 1.5);
        tmp.aim.copy(tmp.look).sub(camera.position).normalize().multiplyScalar(0.35).add(camera.position);
        b.position.lerpVectors(tmp.kickFrom, tmp.aim, k);
        b.rotation.x += 0.4;
        b.rotation.y += 0.25;
      } else {
        b.visible = false;
      }
    }
    // Estela del balón durante la volea
    const flying = !!b && t >= KICK && t < IMPACT;
    if (b) {
      for (let i = trailPos.length - 1; i > 0; i--) trailPos[i].copy(trailPos[i - 1]);
      trailPos[0].copy(b.position);
    }
    trail.current.forEach((sp, i) => {
      if (!sp) return;
      sp.visible = flying;
      sp.position.copy(trailPos[Math.min(i + 1, trailPos.length - 1)]);
      (sp.material as THREE.SpriteMaterial).opacity = 0.45 * (1 - i / trailPos.length);
    });

    // Confeti: estalla con el impacto y cae girando
    const cm = confetti.current;
    if (cm) {
      const ct = t - IMPACT;
      cm.visible = ct > 0 && ct < 5;
      const fade = 1 - smooth(span(ct, 3.2, 5));
      if (cm.visible) {
        confettiData.forEach((c, i) => {
          const u = Math.max(0, ct - c.delay);
          const drag = 1 - Math.exp(-u * 1.6);
          dummy.position.set(
            c.p.x + (c.v.x / 1.6) * drag,
            Math.max(0.01, c.p.y + (c.v.y / 1.6) * drag - 1.4 * u),
            c.p.z + (c.v.z / 1.6) * drag,
          );
          dummy.rotation.set(c.spin.x * u, c.spin.y * u, c.spin.z * u);
          dummy.scale.setScalar(u > 0 ? fade : 0);
          dummy.updateMatrix();
          cm.setMatrixAt(i, dummy.matrix);
        });
        cm.instanceMatrix.needsUpdate = true;
      }
    }
    if (flag.current) flag.current.rotation.y = 0.35 * Math.sin(t * 3.2) + 0.15 * Math.sin(t * 7.1);

    if (t >= IMPACT && !s.impact) {
      s.impact = true;
      onImpact();
    }
    if (t >= IMPACT + 1.2 && !s.ready) {
      s.ready = true;
      onReady();
    }

    /* ── Luces ── */
    if (spot.current) {
      const on = span(t, 0.05, 0.6);
      spot.current.intensity = 75 * on * (on < 1 && Math.sin(t * 60) < 0.2 ? 0.25 : 1);
    }
    lights.current.forEach((sp, i) => {
      if (!sp) return;
      const on = span(t, 0.2 + i * 0.13, 0.4 + i * 0.13);
      (sp.material as THREE.SpriteMaterial).opacity = 0.6 * on * (on < 1 && Math.sin(t * 70 + i) < 0 ? 0.3 : 1);
    });
    flashes.current.forEach((sp, i) => {
      if (!sp) return;
      const f = flashData[i];
      const cyc = ((((t - IMPACT) * f.rate + f.phase) % 1) + 1) % 1;
      (sp.material as THREE.SpriteMaterial).opacity = t > IMPACT ? Math.max(0, 1 - cyc / 0.06) : 0;
    });
    if (dust.current) dust.current.rotation.y = t * 0.08;

    /* ── Cámara ── */
    const toKick = smooth(span(t, 1.8, 2.7));
    const toTitle = smooth(span(t, IMPACT, IMPACT + 1.5));
    const idle = Math.max(0, t - IMPACT - 1.5);
    tmp.cam.set(px + 2.2, 1.25, 6.2); // seguimiento lateral
    tmp.cam.lerp(KICK_CAM, toKick).lerp(TITLE_CAM, toTitle);
    // Al final gira despacio alrededor del jugador
    const orbit = 0.25 * Math.sin(idle * 0.3);
    const ox = tmp.cam.x * Math.cos(orbit) - tmp.cam.z * Math.sin(orbit);
    const oz = tmp.cam.x * Math.sin(orbit) + tmp.cam.z * Math.cos(orbit);
    const camX = lerp(tmp.cam.x, ox, toTitle);
    const camZ = lerp(tmp.cam.z, oz, toTitle);
    const shake = t > IMPACT ? 0.05 * Math.exp(-(t - IMPACT) * 5) : 0;
    // Relieve con el mouse: la cámara se desplaza y la escena gana profundidad
    const par = 0.35 + 0.65 * toTitle;
    camera.position.set(
      camX + shake * Math.sin(t * 63) + pointer.sx * 0.9 * par,
      tmp.cam.y + shake * Math.cos(t * 51) - pointer.sy * 0.45 * par,
      camZ - pointer.sx * 0.5 * par,
    );
    tmp.look.set(lerp(px + 1.0, 0, toKick), lerp(0.85, 1.08, toKick) + 0.05 * toTitle, 0);
    camera.lookAt(tmp.look);
  }, -1);

  return (
    <>
      <spotLight
        ref={spot}
        position={[0.8, 6.5, 1.6]}
        angle={0.45}
        penumbra={0.75}
        intensity={0}
        color="#fff3dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial size={0.018} color="#fef3c7" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {LIGHTS.map(([x, y, z], i) => (
        <group key={x}>
          {/* Torre: poste y panel de focos */}
          <mesh position={[x, y / 2, z]}>
            <cylinderGeometry args={[0.18, 0.3, y, 8]} />
            <meshStandardMaterial color="#1b2b40" roughness={0.8} />
          </mesh>
          <mesh position={[x, y, z]} rotation-y={Math.atan2(x, z)}>
            <boxGeometry args={[3.2, 1.6, 0.3]} />
            <meshBasicMaterial color="#fff6dd" toneMapped={false} />
          </mesh>
          <sprite ref={(el) => void (lights.current[i] = el)} position={[x, y, z + 0.3]} scale={[9, 9, 1]}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} opacity={0} />
          </sprite>
        </group>
      ))}
      {/* Estela del balón */}
      {trailPos.map((_, i) => (
        <sprite key={`tr${i}`} ref={(el) => void (trail.current[i] = el)} scale={[0.32 - i * 0.025, 0.32 - i * 0.025, 1]} visible={false}>
          <spriteMaterial map={glow} color="#a7f3d0" transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
        </sprite>
      ))}
      {/* Confeti */}
      <instancedMesh ref={confetti} args={[undefined, undefined, CONFETTI]} visible={false} frustumCulled={false}>
        <planeGeometry args={[0.045, 0.07]} />
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
      {/* Banderín de córner */}
      <group position={[6.5, 0, -1.1]}>
        <mesh position-y={0.75}>
          <cylinderGeometry args={[0.012, 0.012, 1.5, 8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh ref={flag} position={[0, 1.38, 0]}>
          <planeGeometry args={[0.36, 0.24]} />
          <meshStandardMaterial color="#f59e0b" side={THREE.DoubleSide} />
        </mesh>
      </group>
      {flashData.map((f, i) => (
        <sprite key={i} ref={(el) => void (flashes.current[i] = el)} position={f.pos} scale={[0.5, 0.5, 1]}>
          <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} opacity={0} />
        </sprite>
      ))}

      <group ref={player}>
        <primitive object={rig.root} />
      </group>
      <mesh ref={ball} material={ballMat} castShadow>
        <sphereGeometry args={[R, 40, 28]} />
      </mesh>
    </>
  );
}

function Stage() {
  const grass = useMemo(() => makeGrassTexture(), []);
  const crowd = useMemo(() => makeCrowd(), []);
  const net = useMemo(() => makeNet(7.32, 2.44, 1.8, 0.25), []);
  useEffect(
    () => () => {
      grass.dispose();
      crowd.dispose();
      net.dispose();
    },
    [grass, crowd, net],
  );
  return (
    <>
      <color attach="background" args={[NIGHT]} />
      <fog attach="fog" args={[NIGHT, 8, 34]} />

      {/* Haz de luz del foco (neblina) */}
      <mesh position={[0.8, 3.3, 1.6]}>
        <coneGeometry args={[2.8, 6.6, 32, 1, true]} />
        <meshBasicMaterial color="#fff3dc" transparent opacity={0.035} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} fog={false} />
      </mesh>

      {/* Líneas del área detrás del jugador */}
      <group position={[0, 0.004, -4]}>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, -7.5]}>
          <planeGeometry args={[40.3, 0.08]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, -1]}>
          <planeGeometry args={[16, 0.08]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>
        {[-8, 8].map((x) => (
          <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0, -4.25]}>
            <planeGeometry args={[0.08, 6.5]} />
            <meshBasicMaterial color="#cbd5e1" />
          </mesh>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, -1]}>
          <ringGeometry args={[2.9, 2.98, 48, 1, Math.PI, Math.PI]} />
          <meshBasicMaterial color="#cbd5e1" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Arco al fondo, con red */}
      <group position={[0, 0, -11.5]}>
        {[-3.66, 3.66].map((x) => (
          <mesh key={x} position={[x, 1.22, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 2.44, 10]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
        ))}
        <mesh position={[0, 2.44, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.06, 7.44, 10]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <lineSegments geometry={net}>
          <lineBasicMaterial color="#94a3b8" transparent opacity={0.4} />
        </lineSegments>
      </group>

      {/* Tribuna con público */}
      <mesh position={[0, 4.6, -22]} rotation-x={-0.7}>
        <boxGeometry args={[52, 11, 0.6]} />
        <meshStandardMaterial color="#15243a" roughness={1} fog={false} />
      </mesh>
      <points geometry={crowd}>
        <pointsMaterial size={0.24} vertexColors sizeAttenuation fog={false} transparent opacity={0.85} />
      </points>
      <hemisphereLight args={["#3b5f8a", "#0a3828", 0.7]} />
      {/* Contorno verde desde atrás, relleno cálido bajo y luz frontal suave */}
      <directionalLight position={[-3, 3, -4]} color="#10b981" intensity={3} />
      <pointLight position={[2.4, 0.7, 2]} color="#f59e0b" intensity={1.4} distance={7} />
      <directionalLight position={[5, 3.5, 5]} color="#e6eef8" intensity={1.3} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial map={grass} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.003, -1.1]}>
        <planeGeometry args={[60, 0.07]} />
        <meshBasicMaterial color="#cbd5e1" />
      </mesh>
    </>
  );
}

export default function IntroScene(props: Cb) {
  return (
    <Canvas
      className="intro__canvas"
      shadows="percentage"
      dpr={[1, 1.5]}
      camera={{ position: [2, 1.2, 5], fov: 32, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <Stage />
      <Suspense fallback={null}>
        <Game {...props} />
      </Suspense>
    </Canvas>
  );
}
