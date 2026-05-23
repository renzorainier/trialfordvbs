// AuroraBackground.jsx
// Drop-in background component — place as the first child in a relative container.
// Uses only Tailwind utility classes + inline keyframe injection for the aurora animations.

import React, { useEffect } from "react";

const AURORA_KEYFRAMES = `
@keyframes aurora-drift-1 {
  0%   { transform: translateY(0%)   scaleX(1)    rotate(-3deg); opacity: 0.75; }
  30%  { transform: translateY(-6%)  scaleX(1.05) rotate(-1deg); opacity: 0.9; }
  60%  { transform: translateY(-12%) scaleX(0.97) rotate(-5deg); opacity: 0.7; }
  100% { transform: translateY(0%)   scaleX(1)    rotate(-3deg); opacity: 0.75; }
}
@keyframes aurora-drift-2 {
  0%   { transform: translateY(0%)  scaleX(1)    rotate(2deg);  opacity: 0.65; }
  40%  { transform: translateY(8%)  scaleX(1.08) rotate(4deg);  opacity: 0.85; }
  70%  { transform: translateY(3%)  scaleX(0.95) rotate(1deg);  opacity: 0.6; }
  100% { transform: translateY(0%)  scaleX(1)    rotate(2deg);  opacity: 0.65; }
}
@keyframes aurora-drift-3 {
  0%   { transform: translateY(0%)   scaleX(1)    rotate(-6deg); opacity: 0.8; }
  50%  { transform: translateY(-10%) scaleX(1.1)  rotate(-2deg); opacity: 0.95; }
  100% { transform: translateY(0%)   scaleX(1)    rotate(-6deg); opacity: 0.8; }
}
@keyframes aurora-drift-4 {
  0%   { transform: translateY(0%)  scaleX(1)    rotate(5deg);  opacity: 0.55; }
  35%  { transform: translateY(6%)  scaleX(1.06) rotate(8deg);  opacity: 0.75; }
  65%  { transform: translateY(-4%) scaleX(0.98) rotate(3deg);  opacity: 0.5; }
  100% { transform: translateY(0%)  scaleX(1)    rotate(5deg);  opacity: 0.55; }
}
@keyframes aurora-drift-5 {
  0%   { transform: translateY(0%)  scaleX(1)    rotate(-1deg); opacity: 0.7; }
  45%  { transform: translateY(-8%) scaleX(1.04) rotate(1deg);  opacity: 0.88; }
  100% { transform: translateY(0%)  scaleX(1)    rotate(-1deg); opacity: 0.7; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.4); }
}
`;

// Each ribbon: position (left%), width, height, color stop config, animation
const ribbons = [
  {
    id: 1,
    left: "-8%",
    width: "45%",
    height: "110%",
    top: "-10%",
    gradient: "linear-gradient(170deg, transparent 0%, #0af5c4 18%, #00c896 38%, #7b2fff 62%, transparent 80%)",
    animation: "aurora-drift-1 14s ease-in-out infinite",
    blur: "18px",
    opacity: 0.82,
  },
  {
    id: 2,
    left: "10%",
    width: "38%",
    height: "105%",
    top: "-5%",
    gradient: "linear-gradient(160deg, transparent 0%, #a855f7 15%, #7c3aed 35%, #06b6d4 60%, transparent 78%)",
    animation: "aurora-drift-2 18s ease-in-out infinite",
    blur: "22px",
    opacity: 0.7,
  },
  {
    id: 3,
    left: "28%",
    width: "42%",
    height: "115%",
    top: "-15%",
    gradient: "linear-gradient(175deg, transparent 0%, #10ffb0 12%, #00e5a0 32%, #0ea5e9 55%, transparent 75%)",
    animation: "aurora-drift-3 12s ease-in-out infinite",
    blur: "15px",
    opacity: 0.88,
  },
  {
    id: 4,
    left: "48%",
    width: "36%",
    height: "108%",
    top: "-8%",
    gradient: "linear-gradient(165deg, transparent 0%, #c084fc 20%, #818cf8 42%, #22d3ee 65%, transparent 82%)",
    animation: "aurora-drift-4 20s ease-in-out infinite",
    blur: "20px",
    opacity: 0.65,
  },
  {
    id: 5,
    left: "62%",
    width: "48%",
    height: "112%",
    top: "-12%",
    gradient: "linear-gradient(172deg, transparent 0%, #34d399 15%, #06b6d4 38%, #8b5cf6 62%, transparent 80%)",
    animation: "aurora-drift-5 16s ease-in-out infinite",
    blur: "18px",
    opacity: 0.78,
  },
  // Extra ambient glow ribbons for depth
  {
    id: 6,
    left: "-5%",
    width: "30%",
    height: "90%",
    top: "10%",
    gradient: "linear-gradient(168deg, transparent 0%, #6ee7b7 22%, transparent 60%)",
    animation: "aurora-drift-2 22s ease-in-out infinite reverse",
    blur: "30px",
    opacity: 0.45,
  },
  {
    id: 7,
    left: "55%",
    width: "50%",
    height: "95%",
    top: "5%",
    gradient: "linear-gradient(175deg, transparent 0%, #e879f9 20%, #818cf8 50%, transparent 70%)",
    animation: "aurora-drift-1 25s ease-in-out infinite reverse",
    blur: "35px",
    opacity: 0.38,
  },
];

// Scattered star positions (deterministic so no hydration mismatch)
const stars = [
  { x: 8, y: 5, size: 3, delay: "0s", dur: "3s" },
  { x: 22, y: 12, size: 2, delay: "1.2s", dur: "4s" },
  { x: 38, y: 4, size: 2.5, delay: "0.5s", dur: "3.5s" },
  { x: 55, y: 8, size: 2, delay: "2s", dur: "5s" },
  { x: 71, y: 3, size: 3, delay: "0.8s", dur: "3s" },
  { x: 84, y: 11, size: 2, delay: "1.5s", dur: "4.5s" },
  { x: 93, y: 6, size: 2.5, delay: "0.3s", dur: "3.8s" },
  { x: 14, y: 22, size: 2, delay: "2.5s", dur: "4s" },
  { x: 46, y: 18, size: 3, delay: "1s", dur: "3.2s" },
  { x: 67, y: 24, size: 2, delay: "1.8s", dur: "5s" },
  { x: 79, y: 17, size: 2.5, delay: "0.6s", dur: "3.6s" },
  { x: 31, y: 28, size: 2, delay: "3s", dur: "4.2s" },
  { x: 88, y: 29, size: 3, delay: "0.2s", dur: "3s" },
  { x: 5, y: 38, size: 2, delay: "1.4s", dur: "4.8s" },
  { x: 60, y: 35, size: 2, delay: "2.2s", dur: "3.4s" },
  { x: 43, y: 42, size: 2.5, delay: "0.9s", dur: "5.2s" },
  { x: 19, y: 48, size: 2, delay: "1.7s", dur: "3.9s" },
  { x: 76, y: 44, size: 3, delay: "0.4s", dur: "3.3s" },
  { x: 97, y: 40, size: 2, delay: "2.8s", dur: "4.6s" },
  { x: 52, y: 55, size: 2, delay: "1.1s", dur: "4.1s" },
];

const AuroraBackground = () => {
  useEffect(() => {
    if (document.getElementById("aurora-keyframes")) return;
    const style = document.createElement("style");
    style.id = "aurora-keyframes";
    style.textContent = AURORA_KEYFRAMES;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("aurora-keyframes");
      if (el) el.remove();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        // Deep midnight-blue base matching the reference image
        background:
          "radial-gradient(ellipse 120% 80% at 50% 60%, #0a1f4a 0%, #071535 40%, #040d22 100%)",
        zIndex: 0,
      }}
    >
      {/* Stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            background: "#e0f0ff",
            animation: `twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
            boxShadow: "0 0 4px 1px rgba(180,220,255,0.7)",
          }}
        />
      ))}

      {/* Cross-star sparkles (4-pointed) */}
      {[
        { x: 6, y: 9 },
        { x: 37, y: 6 },
        { x: 53, y: 15 },
        { x: 70, y: 5 },
        { x: 82, y: 19 },
        { x: 25, y: 32 },
        { x: 90, y: 7 },
      ].map((s, i) => (
        <div
          key={`spark-${i}`}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: "10px",
            height: "10px",
            animation: `twinkle ${3 + (i % 3)}s ${i * 0.4}s ease-in-out infinite`,
          }}
        >
          {/* Vertical bar */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              width: "1.5px",
              height: "100%",
              background: "white",
              boxShadow: "0 0 3px 1px rgba(255,255,255,0.8)",
            }}
          />
          {/* Horizontal bar */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              width: "100%",
              height: "1.5px",
              background: "white",
              boxShadow: "0 0 3px 1px rgba(255,255,255,0.8)",
            }}
          />
        </div>
      ))}

      {/* Aurora ribbons */}
      {ribbons.map((r) => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            background: r.gradient,
            filter: `blur(${r.blur})`,
            opacity: r.opacity,
            animation: r.animation,
            transformOrigin: "50% 80%",
            borderRadius: "60% 40% 70% 30% / 60% 50% 50% 40%",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Overall soft vignette overlay to deepen edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(4, 13, 34, 0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default AuroraBackground;

/*
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *
 * // AppWrapper.jsx
 * import React from "react";
 * import AuroraBackground from "./AuroraBackground";
 * import Talk from "./Talk";
 * import Main from "./Main";
 *
 * const AppWrapper = () => {
 *   return (
 *     <div className="relative min-h-screen w-full">
 *       {/* 🌌 Aurora background layer *\/}
 *       <AuroraBackground />
 *
 *       {/* 🧠 Main app content *\/}
 *       <div className="relative z-10 main-app-content">
 *         <Main />
 *       </div>
 *
 *       {/* 🎤 Floating voice chat *\/}
 *       <Talk />
 *     </div>
 *   );
 * };
 *
 * export default AppWrapper;
 *
 * ─── NOTE ────────────────────────────────────────────────────────────────────
 * Add  className="relative z-10"  to any content div that should sit above
 * the aurora so it renders on top.
 * ─────────────────────────────────────────────────────────────────────────────
 */