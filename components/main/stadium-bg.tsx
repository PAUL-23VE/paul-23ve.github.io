"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// El estadio 3D de fondo (con three.js, ~900 KB) se carga aparte y sin bloquear el arranque
// de la página: así la intro y el contenido aparecen antes en conexiones lentas.
// Mientras llega, se ve el fondo oscuro del <body>, del mismo color que la escena.
const StadiumScene = dynamic(
  () => import("@/components/main/stadium-scene").then((m) => m.StadiumScene),
  { ssr: false },
);

// Navegadores sin WebGL (o con la aceleración desactivada): solo el fondo oscuro, sin errores
let webgl: boolean | null = null;
const hasWebGL = () => {
  if (webgl === null) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
};
const subscribe = () => () => {};

export const StadiumBackground = () => {
  const ok = useSyncExternalStore(subscribe, hasWebGL, () => false);
  return ok ? <StadiumScene /> : null;
};
