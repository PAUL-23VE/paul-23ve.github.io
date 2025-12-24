// components/ProjectCard.jsx
import { useState, useRef, useEffect } from "react";

function ProjectCard({ title, description, link, images, frontend, backend }) {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const hasImages = images && images.length > 0;
  const transitioning = useRef(false);

  // Carousel: show one image at a time, centered, and loop in a circular way (auto-advance)
  useEffect(() => {
    if (!hasImages || images.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500); // Más tiempo para mejor UX
    return () => clearInterval(interval);
  }, [hasImages, images]);

  const showImage = () => {
    if (!hasImages) return null;
    return images[current];
  };

  const handleDotClick = (idx) => {
    if (idx === current || transitioning.current) return;
    transitioning.current = true;
    setCurrent(idx);
    setTimeout(() => { transitioning.current = false; }, 400);
  };

  // Modal navigation
  const handleModalNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const handleModalPrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white/90 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition duration-300 flex flex-col justify-between h-full border border-gray-100 backdrop-blur-md">
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight text-center drop-shadow-sm">{title}</h3>
        <p className="text-gray-700 mb-6 text-base leading-relaxed text-center max-w-2xl mx-auto">{description}</p>
        {hasImages && (
          <div className="flex flex-col items-center justify-center mb-6 w-full">
            <div className="relative flex flex-row justify-center items-center w-full" style={{ minHeight: 220, minWidth: 0 }}>
              <div className="relative group flex-shrink-0 transition-all duration-700" style={{ minWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={showImage()}
                  alt={title + ' screenshot ' + (current + 1)}
                  className="w-[480px] h-[270px] object-cover rounded-2xl border border-gray-200 shadow-lg transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:shadow-2xl bg-gray-50 cursor-pointer"
                  style={{ maxWidth: 480, minWidth: 320, width: '100%', height: 270, display: 'block', aspectRatio: '16/9', position: 'relative' }}
                  onClick={() => setModalOpen(true)}
                />
                {/* Overlay con mensaje al hacer hover */}
                <div className="absolute inset-0 flex items-end justify-end pointer-events-none" style={{transition: 'opacity 0.22s', opacity: 0, background: 'transparent', borderRadius: 16, zIndex: 2, padding: 18}}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(0,0,0,0.65)',
                    color: '#00ffe7',
                    fontWeight: 600,
                    fontSize: 14,
                    padding: '5px 14px',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #0006',
                    border: '1.2px solid #00ffe7',
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                    letterSpacing: 0.5,
                  }}>
                    <svg width="18" height="18" fill="none" stroke="#00ffe7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 3v3a1 1 0 0 1-1 1H3m13 0V3m0 18v-3a1 1 0 0 1 1-1h3m-6 0v3m0-6h.01"/></svg>
                    Ver más
                  </span>
                </div>
                <style>{`
                  .group:hover > .absolute.inset-0 {
                    opacity: 1 !important;
                  }
                `}</style>
              </div>
            </div>
            {images && images.length > 1 && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className="flex gap-2 mt-2 items-center" style={{ marginTop: '12px', marginBottom: '0' }}>
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      aria-label={`Ir a la imagen ${idx + 1}`}
                      className={`w-3.5 h-3.5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${idx === current ? 'bg-blue-600 border-blue-400 scale-125 shadow-lg' : 'bg-gray-300 border-gray-200 hover:bg-blue-200'}`}
                      style={{ boxShadow: idx === current ? '0 0 8px #2563eb88' : undefined }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal para imagen grande */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={handleModalPrev} style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)', fontSize: 40, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1001 }} aria-label="Anterior">&#8592;</button>
          <img
            src={showImage()}
            alt={title + ' screenshot grande ' + (current + 1)}
            style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 24, boxShadow: '0 8px 40px #000a', border: '4px solid #fff', background: '#fff' }}
            onClick={e => e.stopPropagation()}
          />
          <button onClick={handleModalNext} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', fontSize: 40, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1001 }} aria-label="Siguiente">&#8594;</button>
          <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 30, right: 40, fontSize: 32, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1001 }} aria-label="Cerrar">&#10006;</button>
        </div>
      )}
      <div className="flex flex-row flex-wrap gap-6 mt-2 justify-center items-center github-links-container" style={{ width: '100%', marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
        {frontend && (
          <a
            href={frontend}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link github-link-frontend"
            style={{ minWidth: 200, justifyContent: 'center', textAlign: 'center', margin: '0 12px' }}
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'><path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/></svg>
            Frontend en GitHub
          </a>
        )}
        {backend && (
          <a
            href={backend}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link github-link-backend"
            style={{ minWidth: 200, justifyContent: 'center', textAlign: 'center', margin: '0 12px' }}
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'><path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/></svg>
            Backend en GitHub
          </a>
        )}
        {link && !frontend && !backend && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link github-link-generic"
            style={{ minWidth: 200, justifyContent: 'center', textAlign: 'center', margin: '0 12px' }}
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'><path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/></svg>
            Ver en GitHub
          </a>
        )}
      </div>
      <style>{`
        .github-link {
          background: linear-gradient(90deg, #00ffe7 0%, #667eea 100%);
          color: #222;
          border: none;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 16px #00ffe733;
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          position: relative;
          overflow: hidden;
          margin: 0 12px;
        }
        .github-link svg {
          transition: transform 0.22s cubic-bezier(.4,0,.2,1);
        }
        .github-link:hover {
          color: #fff;
          background: linear-gradient(90deg, #667eea 0%, #00ffe7 100%);
          box-shadow: 0 8px 32px #00ffe799, 0 2px 8px #667eea55;
          transform: translateY(-2px) scale(1.045);
        }
        .github-link:hover svg {
          transform: scale(1.18) rotate(-8deg);
          filter: drop-shadow(0 0 6px #00ffe7cc);
        }
        .github-link-frontend {
          border: 2px solid #00ffe7;
        }
        .github-link-backend {
          border: 2px solid #667eea;
        }
        .github-link-generic {
          border: 2px solid #00bfff;
        }
      `}</style>
    </div>
  );
}

export default ProjectCard;
