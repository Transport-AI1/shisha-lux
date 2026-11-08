"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Variant = { name: string; c1: string; c2: string; accent: string };

// Ilustraciones conceptuales (vectoriales, sin fondo). Para usar fotos reales de
// producto, sustituye <Hookah/> por una <img> con PNG/WebP transparente.
const variants: Variant[] = [
  { name: "NEÓN ROSA", c1: "#ed55c5", c2: "#5a1450", accent: "#ff9be3" },
  { name: "HIELO", c1: "#4de4ee", c2: "#0d4f58", accent: "#a6f6fb" },
  { name: "DORADA", c1: "#f0c66e", c2: "#6e4a14", accent: "#ffe3a1" },
];

function Hookah({ id, v }: { id: string; v: Variant }) {
  return (
    <svg viewBox="0 0 220 440" aria-hidden="true" focusable="false">
    <defs>
    <linearGradient id={`${id}m`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#555a69"/><stop offset=".42" stopColor="#f3f4fa"/><stop offset=".7" stopColor="#9096a8"/><stop offset="1" stopColor="#434754"/></linearGradient>
    <linearGradient id={`${id}g`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={v.c1} stopOpacity=".95"/><stop offset="1" stopColor={v.c2} stopOpacity=".95"/></linearGradient>
    <linearGradient id={`${id}b`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={v.c2}/><stop offset=".45" stopColor={v.c1}/><stop offset="1" stopColor={v.c2}/></linearGradient>
    <filter id={`${id}f`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
    </defs>
    <path d="M120 232 C 196 228 214 300 182 352" fill="none" stroke="#1d2029" strokeWidth="8" strokeLinecap="round"/>
    <path d="M120 232 C 196 228 214 300 182 352" fill="none" stroke={v.accent} strokeOpacity=".4" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round"/>
    <rect x="174" y="348" width="16" height="32" rx="6" transform="rotate(18 182 352)" fill={`url(#${id}m)`}/>
    <path d="M94 292 L94 330 C 44 342 34 398 76 414 C 96 421 124 421 144 414 C 186 398 176 342 126 330 L126 292 Z" fill={`url(#${id}g)`} stroke="#ffffff" strokeOpacity=".35" strokeWidth="1.5"/>
    <path d="M58 372 C 62 400 86 412 110 412 C 134 412 158 400 162 372 C 140 380 128 366 110 372 C 92 378 78 366 58 372 Z" fill="#ffffff" fillOpacity=".22"/>
    <path d="M62 350 C 56 372 62 392 76 402" fill="none" stroke="#ffffff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round"/>
    <rect x="84" y="282" width="52" height="14" rx="5" fill={`url(#${id}m)`}/>
    <rect x="100" y="112" width="20" height="172" fill={`url(#${id}m)`}/>
    <rect x="93" y="262" width="34" height="9" rx="4" fill={v.accent}/>
    <ellipse cx="110" cy="236" rx="19" ry="11" fill={`url(#${id}m)`}/>
    <rect x="95" y="194" width="30" height="7" rx="3" fill={v.accent}/>
    <rect x="97" y="160" width="26" height="6" rx="3" fill={v.accent}/>
    <ellipse cx="110" cy="128" rx="64" ry="13" fill="#3b3f4c"/>
    <ellipse cx="110" cy="122" rx="64" ry="13" fill={`url(#${id}m)`}/>
    <ellipse cx="110" cy="121" rx="52" ry="8" fill="#2a2d38"/>
    <path d="M84 122 L136 122 L130 84 C128 76 92 76 90 84 Z" fill={`url(#${id}b)`}/>
    <ellipse cx="110" cy="84" rx="21" ry="6" fill="#241712"/>
    <circle cx="102" cy="83" r="2.2" fill="#ff7a2f"/><circle cx="112" cy="85" r="2.6" fill="#ffb347"/><circle cx="119" cy="83" r="1.8" fill="#ff7a2f"/>
    <g className="hk-smoke"><path d="M108 76 C 92 56 128 44 112 20" fill="none" stroke="#ffffff" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" filter={`url(#${id}f)`}/></g>
    </svg>
  );
}

export default function HookahShowcase() {
  const n = variants.length;
  const [st, setSt] = useState({ active: 0, prev: -1 });
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const step = (d: number) =>
    setSt((s) => ({ prev: s.active, active: (s.active + d + n) % n }));
  const goTo = (i: number) =>
    setSt((s) => (s.active === i ? s : { prev: s.active, active: i }));

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => step(1), 4200);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <div
      className="hookah-stage"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Cachimbas de Shisha Lux (ilustración conceptual)"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      }}
    >
      {variants.map((v, i) => {
        const rel = (i - st.active + n) % n;
        const prevRel = st.prev < 0 ? -1 : (i - st.prev + n) % n;
        const entering = rel === 1 && prevRel === 2;
        return (
          <div
            key={v.name}
            className={`hk-item rel-${rel}${entering ? " enter" : ""}`}
            style={{ "--glow": v.c1 } as CSSProperties}
            aria-hidden={rel !== 0}
          >
            <div className="hk-float"><Hookah id={`hk${i}`} v={v} /></div>
            <div className="hk-ground" />
          </div>
        );
      })}
      <div className="hk-meta">
        <span className="hk-name">{variants[st.active].name} · 0{st.active + 1} / 0{n}</span>
        <div className="hk-dots">
          {variants.map((v, i) => (
            <button
              key={v.name}
              type="button"
              className={i === st.active ? "on" : ""}
              onClick={() => goTo(i)}
              aria-label={`Ver cachimba ${i + 1}: ${v.name}`}
            />
          ))}
        </div>
        <span className="hk-cap">ILUSTRACIÓN CONCEPTUAL</span>
      </div>
    </div>
  );
}
