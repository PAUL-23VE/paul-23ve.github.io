"use client";

import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ─────────────────────────────────────────────────────────────
//  Futbolista estilo videojuego para la intro.
//  Modelo y animaciones: Quaternius — "Universal Base Characters" y
//  "Universal Animation Library" (licencia CC0, dominio público).
//  El personaje viene sin ropa: el uniforme (camiseta con el 10, short, medias y
//  botines) se pinta en su material según la zona del cuerpo en la pose de reposo.
// ─────────────────────────────────────────────────────────────

export const PLAYER_URL = "/intro/player.glb";
export const MOVES_URL = "/intro/moves.glb";

// Altura de la cadera del personaje / del maniquí de las animaciones
const PELVIS_RATIO = 0.9491 / 0.9167;

/* ── Estampado de la camiseta: arriba la espalda (apellido y 10), abajo el pecho ── */
function kitDecals() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.textAlign = "center";
  g.textBaseline = "middle";
  // Espalda
  g.fillStyle = "#f8fafc";
  g.font = "800 46px Inter, Arial, sans-serif";
  g.fillText("VELASTEGUI", 256, 40);
  g.lineWidth = 12;
  g.strokeStyle = "#065f46";
  g.font = "900 200px Inter, Arial, sans-serif";
  g.strokeText("10", 256, 160);
  g.fillText("10", 256, 160);
  // Pecho: número pequeño a la derecha del jugador y escudo a su izquierda
  g.font = "900 80px Inter, Arial, sans-serif";
  g.lineWidth = 6;
  g.strokeText("10", 140, 360);
  g.fillText("10", 140, 360);
  g.beginPath();
  g.arc(372, 352, 40, 0, Math.PI * 2);
  g.fillStyle = "#f59e0b";
  g.fill();
  g.fillStyle = "#0b131e";
  g.font = "900 38px Inter, Arial, sans-serif";
  g.fillText("PV", 372, 354);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Pinta el uniforme sobre el material de la piel. vRest = posición en reposo (pose T,
// metros, Y arriba, el jugador mira a +Z), así las zonas siguen al cuerpo al animarse.
function dressKit(mat: THREE.MeshStandardMaterial, decals: THREE.Texture) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uKit = { value: decals };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vRest;\nvarying float vCloth;")
      .replace(
        "#include <begin_vertex>",
        /* glsl */ `#include <begin_vertex>
        vRest = position;
        {
          float ay = position.y;
          float ax = abs(position.x);
          float neck = step((ax / 0.085) * (ax / 0.085) + ((ay - 1.62) / 0.13) * ((ay - 1.62) / 0.13), 1.0);
          float jersey = step(0.97, ay) * step(ay, 1.6) * step(ax, 0.40) * (1.0 - neck);
          float shorts = step(0.60, ay) * step(ay, 0.99) * step(ax, 0.32);
          float hem = smoothstep(0.68, 0.60, ay) * shorts;
          float socks = step(0.105, ay) * step(ay, 0.5);
          // Botín: la propia piel del pie se engrosa (sigue al pie en cada movimiento)
          float boot = 1.0 - step(0.105, ay);
          vCloth = max(max(max(jersey, shorts), socks), boot);
          // La tela queda separada del cuerpo (oculta los músculos); el short se abre en el borde
          transformed += normal * (jersey * 0.018 + shorts * 0.026 + hem * 0.018 + socks * 0.004);
          // Botín: un poco más grueso, con la punta redondeada y la suela plana
          float toe = smoothstep(0.02, 0.12, position.z);
          transformed += normal * boot * (0.008 + 0.006 * toe);
          transformed.y -= boot * step(position.y, 0.012) * 0.006;
        }`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vRest;\nvarying float vCloth;\nuniform sampler2D uKit;")
      // La tela no lleva el relieve muscular del mapa de normales
      .replace(
        "#include <normal_fragment_maps>",
        "#include <normal_fragment_maps>\nif (vCloth > 0.5) normal = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);",
      )
      .replace(
        "#include <map_fragment>",
        /* glsl */ `#include <map_fragment>
        {
          vec3 p = vRest;
          float ay = p.y;
          float ax = abs(p.x);
          // Distancia elíptica al cuello (< 1: abertura del cuello)
          float neckD = (ax / 0.085) * (ax / 0.085) + ((ay - 1.62) / 0.13) * ((ay - 1.62) / 0.13);
          vec3 green = vec3(0.004, 0.42, 0.19);
          vec3 greenDark = vec3(0.003, 0.22, 0.10);
          vec3 white = vec3(0.82, 0.84, 0.86);
          vec3 amber = vec3(0.91, 0.34, 0.004);
          vec3 black = vec3(0.012, 0.014, 0.02);
          vec3 kit = diffuseColor.rgb;
          if (ay < 0.105) {
            // Botín dorado: suela negra, cuello negro, franja lateral y cordones
            kit = amber;
            kit *= 0.85 + 0.15 * smoothstep(0.0, 0.08, ay); // más oscuro abajo
            float side = abs(p.x) - 0.13; // < 0 hacia el interior del pie
            if (ay < 0.016) kit = black; // suela
            else if (ay < 0.022) kit = vec3(0.85); // borde de la suela
            if (ay > 0.088) kit = black; // cuello del botín
            // Franja diagonal en el costado exterior
            if (abs(side) > 0.02 && abs(ay - 0.035 - (p.z + 0.05) * 0.25) < 0.008 && p.z > -0.1 && p.z < 0.06) kit = black;
            // Cordones sobre el empeine
            if (abs(side) < 0.012 && p.z > -0.02 && p.z < 0.07 && ay > 0.03 && fract(p.z * 55.0) < 0.35) kit = vec3(0.9);
          } else if (ay < 0.5) {
            kit = greenDark; // medias
            if ((ay > 0.43 && ay < 0.465) || (ay > 0.40 && ay < 0.41)) kit = white;
          } else if (ay > 0.60 && ay < 0.99 && ax < 0.32) {
            kit = vec3(0.012, 0.02, 0.035); // short azul noche
            if (ax > 0.1 && abs(p.z) < 0.022) kit = green;
            if (ay < 0.625) kit = white * 0.7; // ribete
          } else if (ay > 0.99 && ay < 1.6 && ax < 0.40 && neckD > 1.0) {
            // Camiseta: degradado, rayas finas y ribetes en cuello y mangas
            kit = mix(greenDark, green, smoothstep(1.0, 1.4, ay));
            kit *= 0.93 + 0.07 * step(0.5, fract(p.x * 45.0));
            if (neckD < 1.45) kit = white; // ribete del cuello en U
            if (ax > 0.37) kit = white;
            // Estampados: espalda (z < 0) y pecho (z > 0)
            vec2 uv = vec2(-1.0);
            if (p.z < -0.03) uv = vec2((0.15 - p.x) / 0.30, 0.5 + clamp((ay - 1.07) / 0.34, 0.0, 1.0) * 0.5);
            if (p.z > 0.03) uv = vec2((p.x + 0.15) / 0.30, clamp((ay - 1.2) / 0.2, 0.0, 1.0) * 0.5);
            if (uv.x > 0.0 && uv.x < 1.0 && ay > 1.07 && ay < 1.41) {
              vec4 d = texture2D(uKit, uv);
              kit = mix(kit, d.rgb, d.a);
            }
          }
          diffuseColor.rgb = kit;
        }`,
      );
  };
  mat.needsUpdate = true;
}

// Solo rotaciones (más la posición de la cadera ajustada a la altura del personaje)
function adaptClip(clip: THREE.AnimationClip) {
  clip.tracks = clip.tracks.filter((t) => t.name.endsWith(".quaternion") || t.name === "pelvis.position");
  for (const t of clip.tracks) {
    if (t.name === "pelvis.position") for (let i = 0; i < t.values.length; i++) t.values[i] *= PELVIS_RATIO;
  }
  return clip;
}

export type PlayerRig = {
  root: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  bones: Record<string, THREE.Bone>;
};

export function usePlayer(): PlayerRig {
  const gltf = useLoader(GLTFLoader, PLAYER_URL);
  const moves = useLoader(GLTFLoader, MOVES_URL);

  const rig = useMemo(() => {
    const root = gltf.scene;
    const decals = kitDecals();
    const bones: Record<string, THREE.Bone> = {};
    let body: THREE.SkinnedMesh | null = null;
    root.traverse((o) => {
      if ((o as THREE.Bone).isBone) bones[o.name] = o as THREE.Bone;
      const m = o as THREE.SkinnedMesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.frustumCulled = false;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat.name === "MI_Superhero_Male") {
          body = m;
          dressKit(mat, decals);
          // Menos relieve muscular en la piel
          mat.normalScale.set(0.2, 0.2);
        }
        // La textura del pelo es clara (pensada para teñirse): castaño oscuro
        if (mat.name.startsWith("MI_Hair")) mat.color.set("#3a2416");
      }
    });
    // El peinado viene en su sitio sobre la cabeza en reposo: se cuelga del hueso "Head"
    const hair = root.getObjectByName("Hair");
    root.updateMatrixWorld(true);
    if (hair && bones.Head) bones.Head.attach(hair);
    // Silueta menos musculosa: más delgado de lado a lado y de frente a espalda
    root.scale.set(0.86, 1, 0.86);

    const mixer = new THREE.AnimationMixer(root);
    const actions: Record<string, THREE.AnimationAction> = {};
    for (const clip of moves.animations) {
      const a = mixer.clipAction(adaptClip(clip.clone()));
      a.play();
      a.paused = true; // el guion controla el tiempo y el peso de cada animación
      a.setEffectiveWeight(0);
      actions[clip.name] = a;
    }
    return { root, mixer, actions, bones, decals };
  }, [gltf, moves]);

  useEffect(
    () => () => {
      rig.decals.dispose();
    },
    [rig],
  );
  return rig;
}

useLoader.preload(GLTFLoader, PLAYER_URL);
useLoader.preload(GLTFLoader, MOVES_URL);
