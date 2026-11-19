// Intro antes del portafolio (components/main/intro.tsx).
// Este script corre en <head> antes de pintar la página y decide si la intro se muestra:
// · ya se vio en esta sesión, o el usuario pidió "reducir movimiento" → html.intro-skip
// · si no → html.intro-lock (sin scroll y con las animaciones del inicio en pausa)
// Por seguridad, si a los 12 s la intro no llegó a arrancar (falló el JS), se quita el bloqueo.
// Si arrancó, la intro espera a que el usuario presione algo o se desplace.
export const INTRO_KEY = "intro-seen";

export const INTRO_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-skip");return}}catch(e){}d.classList.add("intro-lock");setTimeout(function(){if(!document.querySelector(".intro.is-playing"))d.classList.remove("intro-lock")},12000)})();`;
