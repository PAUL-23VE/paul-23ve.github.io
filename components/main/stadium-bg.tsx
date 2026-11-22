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
// Mientras se ve la intro (html.intro-lock) el estadio queda tapado: se descarga después,
// así todo el ancho de banda inicial va para la intro.
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const canShow = () => hasWebGL() && !document.documentElement.classList.contains("intro-lock");

export const StadiumBackground = () => {
  const ok = useSyncExternalStore(subscribe, canShow, () => false);
  return ok ? <StadiumScene /> : null;
};
