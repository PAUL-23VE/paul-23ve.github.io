// AnimatedBackground.jsx
import React, { useEffect, useState } from "react";

function AnimatedBackground() {
  const [particles, setParticles] = useState([]);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    setParticles(
      [...Array(40)].map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 3,
      }))
    );
    setBubbles(
      [...Array(8)].map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 40,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 15,
      }))
    );
  }, []);

  return (
    <>
      {/* Burbujas grandes */}
      {bubbles.map(({ id, left, size, delay, duration }) => (
        <div
          key={id}
          style={{
            position: "fixed",
            bottom: "-50px",
            left,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "rgba(0, 255, 231, 0.12)",
            filter: "blur(8px)",
            animationName: "bubbleMove",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            zIndex: 0,
          }}
        />
      ))}
      {/* Partículas pequeñas */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}>
        {particles.map(({ id, left, size, delay, duration }) => (
          <div
            key={id}
            style={{
              position: "absolute",
              left,
              width: size,
              height: size,
              background: "rgba(0, 255, 231, 0.3)",
              borderRadius: "50%",
              animation: `float infinite ease-in-out`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        body {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 100%) !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg);}
          50% { transform: translateY(-20px) rotate(180deg);}
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) rotate(0deg);}
          50% { transform: translateY(-20px) rotate(180deg);}
          100% { transform: translateY(0) rotate(360deg);}
        }
      `}</style>
    </>
  );
}

export default AnimatedBackground;
