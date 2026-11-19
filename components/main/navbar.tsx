"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NAV_LINKS, SITE, SOCIALS } from "@/constants";

// Devuelve el enlace del apartado que se está viendo (o "" si es el inicio).
const useActiveSection = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.link.slice(1));
    let frame = 0;

    const update = () => {
      frame = 0;
      // Un apartado cuenta como "actual" cuando su inicio pasa el tercio superior de la pantalla.
      const line = window.innerHeight * 0.35;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = `#${id}`;
      }
      // Al llegar al final de la página, el último apartado gana aunque sea corto.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = `#${ids[ids.length - 1]}`;
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
};

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const active = useActiveSection();
  const activeTitle = NAV_LINKS.find((link) => link.link === active)?.title;

  return (
    <header className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#0e6145]/50 bg-[#0b131ee6] z-50 px-4 md:px-10">
      <div className="w-full h-full flex items-center justify-between m-auto px-[10px]">
        {/* Logo + nombre */}
        <Link
          href="#inicio"
          className="flex min-w-0 items-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-300 to-amber-400 text-sm font-bold text-white shadow-[0_0_18px_#1ce09faa]"
          >
            PV
          </span>
          <span className="font-bold ml-[10px] text-gray-300 truncate">{SITE.name}</span>
        </Link>

        {/* Navegación de escritorio */}
        <nav
          aria-label="Principal"
          className="hidden lg:flex h-full flex-row items-center justify-between"
        >
          <div className="flex items-center gap-1 h-auto border border-[rgba(28, 224, 159,0.38)] bg-[rgba(11, 19, 29,0.37)] px-[8px] py-[6px] rounded-full text-gray-200">
            {NAV_LINKS.map((link) => {
              const isActive = link.link === active;
              return (
                <Link
                  key={link.title}
                  href={link.link}
                  aria-current={isActive ? "true" : undefined}
                  className={`nav-link${isActive ? " nav-link--active" : ""}`}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Redes (escritorio) */}
        <div className="hidden lg:flex flex-row gap-5">
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              key={name}
              aria-label={name}
              className="text-white hover:text-[rgb(144, 241, 209)] transition"
            >
              <Icon className="h-6 w-6" />
            </Link>
          ))}
        </div>

        {/* Móvil: apartado actual + botón de menú */}
        <div className="lg:hidden flex shrink-0 items-center gap-1 pl-2">
          {activeTitle && !isMobileMenuOpen && (
            <span className="nav-link nav-link--active !px-3 !py-1 text-xs" aria-hidden="true">
              {activeTitle}
            </span>
          )}
          <button
            className="text-white h-11 w-11 flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="menu-movil"
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="menu-movil"
          className="absolute top-[65px] left-0 w-full bg-[#0b131d] border-b border-[#0e6145] p-6 flex flex-col items-center text-gray-300 lg:hidden"
        >
          <nav aria-label="Principal móvil" className="flex flex-col items-center gap-3 text-lg">
            {NAV_LINKS.map((link) => {
              const isActive = link.link === active;
              return (
                <Link
                  key={link.title}
                  href={link.link}
                  aria-current={isActive ? "true" : undefined}
                  className={`nav-link${isActive ? " nav-link--active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex justify-center gap-6 mt-6">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <Link href={link} target="_blank" rel="noreferrer noopener" key={name} aria-label={name}>
                <Icon className="h-8 w-8 text-white" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
