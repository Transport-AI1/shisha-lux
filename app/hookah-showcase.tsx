"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
type Item = { src: string; name: string; glow: string; alt: string };
const items: Item[] = [
 { src: "/cachimbas/cachimba-1.svg", name: "SELECCIÓN 01", glow: "#4de4ee", alt: "Cachimba con base azul y manguera turquesa" },
 { src: "/cachimbas/cachimba-2.svg", name: "SELECCIÓN 02", glow: "#6f9bff", alt: "Cachimba con base de cristal tallado y manguera azul" },
 { src: "/cachimbas/cachimba-3.svg", name: "SELECCIÓN 03", glow: "#ed55c5", alt: "Cachimba negra con base de cristal ahumado" },
];
export default function HookahShowcase() {
 const n=items.length;
 const [st,setSt]=useState({active:0,prev:-1});
 const [paused,setPaused]=useState(false);
 const touchX=useRef<number|null>(null);
 const step=(d:number)=>setSt(s=>({prev:s.active,active:(s.active+d+n)%n}));
 const goTo=(i:number)=>setSt(s=>s.active===i?s:{prev:s.active,active:i});
 useEffect(()=>{if(paused||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const t=window.setInterval(()=>step(1),4600);return()=>window.clearInterval(t)},[paused]);
 return <div className="hookah-stage" role="region" aria-roledescription="carrusel" aria-label="Cachimbas de referencia"
  onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
  onTouchStart={e=>{touchX.current=e.touches[0].clientX}}
  onTouchEnd={e=>{if(touchX.current===null)return;const dx=e.changedTouches[0].clientX-touchX.current;touchX.current=null;if(Math.abs(dx)>40)step(dx<0?1:-1)}}>
  <div className="hk-aura" aria-hidden="true" style={{"--glow":items[st.active].glow} as CSSProperties}/>
  {items.map((it,i)=>{const rel=(i-st.active+n)%n;const prevRel=st.prev<0?-1:(i-st.prev+n)%n;const entering=rel===1&&prevRel===2;return <div key={it.src} className={`hk-item rel-${rel}${entering?" enter":""}`} style={{"--glow":it.glow} as CSSProperties} aria-hidden={rel!==0}>
   <div className="hk-float"><img src={it.src} alt={it.alt} width={480} height={640} decoding="async" draggable={false}/></div><div className="hk-ground"/>
  </div>})}
  <div className="hk-meta"><span className="hk-name">{items[st.active].name} · 0{st.active+1} / 0{n}</span>
   <div className="hk-dots">{items.map((it,i)=><button key={it.src} type="button" className={i===st.active?"on":""} onClick={()=>goTo(i)} aria-label={`Ver cachimba ${i+1}`}/>)}</div>
   <span className="hk-cap">IMÁGENES DE REFERENCIA</span>
  </div>
 </div>;
}
