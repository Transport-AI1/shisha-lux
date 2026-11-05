"use client";
import { FormEvent, useState } from "react";

const photos = {
  hero: "https://www.shishalux.es/images/sala_lux.webp",
  garden: "https://www.shishalux.es/images/terraza_heineken_2.jpg",
  summer: "https://www.shishalux.es/images/terraza_summer.webp",
  vipSmall: "https://www.shishalux.es/images/IMG-20240707-WA0040.webp",
  vipLarge: "https://www.shishalux.es/images/IMG-20240715-WA0084.webp",
};
type Message = { role: "bot" | "user"; text: string };
const initial: Message[] = [{ role: "bot", text: "¡Hola! Soy el asistente virtual de Shisha Lux. ✨\nPuedo ayudarte con información sobre nuestras salas, terrazas, cachimbas, cócteles, comida y horarios. ¿Qué te gustaría saber?" }];

function answer(q: string) {
  const s = q.toLowerCase();
  if (/reserv|mesa|cumple|grupo|disponib/.test(s)) return "¡Claro! Para reservas de salas VIP o grupos de 9 personas o más, el equipo atiende en el +34 660 46 19 26.\n\n✨ Próximamente podrás consultar opciones y gestionar tu reserva directamente conmigo, con un agente conectado a Voiceflow. Esta función todavía no está activa.";
  if (/vip|osa mayor|billar|dardo|play/.test(s)) return "Tenemos dos espacios VIP: Osa Mayor, con capacidad máxima para 20 personas, billar, dardos y PlayStation 5; y Osa Menor, para hasta 8 personas, con televisión, PlayStation 5 y futbolín. Para reservarlos, contacta con el equipo en el +34 660 46 19 26.";
  if (/terraza|garden|summer|exterior/.test(s)) return "Shisha Lux cuenta con la Terraza Garden Heineken y la Terraza Summer, pensadas para disfrutar de un ambiente relajado. Para confirmar disponibilidad de una zona concreta, llama al +34 660 46 19 26.";
  if (/horar|abri|cerr|cuando/.test(s)) return "Horario publicado: lunes a jueves de 17:00 a 01:00; viernes de 17:00 a 02:30; sábado de 16:00 a 02:30; domingo de 16:00 a 01:00. Puede haber cambios puntuales, así que recomendamos confirmarlo antes de venir.";
  if (/donde|direc|ubic|llegar/.test(s)) return "Estamos en Avenida Aurelio Álvarez, 7, 28521 Rivas-Vaciamadrid (Madrid). Puedes llamarnos al +34 660 46 19 26.";
  if (/comida|hamburg|carta|comer|desayun|food/.test(s)) return "En Shisha Lux puedes disfrutar de comida y picoteo, además de cócteles y batidos. Para consultar la carta y confirmar platos o alérgenos, contacta directamente con el establecimiento.";
  if (/cachimb|shisha|sabor|tabaco/.test(s)) return "La experiencia Shisha Lux incluye cachimbas premium y distintas mezclas y sabores. Para conocer las opciones disponibles hoy, el equipo puede orientarte en el +34 660 46 19 26.";
  if (/hola|buenas|buenos|hey/.test(s)) return "¡Hola! Bienvenido a Shisha Lux. ¿Quieres saber algo sobre nuestras salas VIP, terrazas, cachimbas, comida, cócteles u horarios?";
  return "Puedo ayudarte con información sobre las salas VIP, terrazas, cachimbas, cócteles, comida, horarios y ubicación. Para confirmar disponibilidad o condiciones concretas, contacta con el equipo en el +34 660 46 19 26.\n\nPróximamente, con la integración de Voiceflow, podré gestionar conversaciones y solicitudes más avanzadas.";
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  function send(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    window.setTimeout(() => {
      setMessages(m => [...m, { role: "bot", text: answer(q) }]);
      setBusy(false);
    }, 350);
  }
  return <main className="shell">
    <header className="nav">
      <a className="brand" href="#">SHISHA<span>LUX</span></a>
      <nav className="navlinks"><a href="#espacios">Espacios</a><a href="#vip">Salas VIP</a><a href="#experiencia">Experiencia</a><a href="#contacto">Contacto</a></nav>
      <a className="navcta" href="https://wa.me/34660461926" target="_blank" rel="noreferrer">Hablemos ↗</a>
    </header>
    <section className="hero">
      <div>
        <div className="eyebrow">RIVAS · COCKTAILS · SHISHA · MOMENTS</div>
        <h1>Tu momento.<br/><em>Tu lugar.</em><br/>Tu Lux.</h1>
        <p className="lead">Un espacio para desconectar, compartir y disfrutar. Descubre nuestras salas, terrazas, cachimbas y una experiencia pensada para quedarse un rato más.</p>
        <div className="actions"><a className="btn" href="#espacios">Descubrir Shisha Lux ↘</a><button className="btn secondary" onClick={() => setOpen(true)}>Hablar con el asistente ✦</button></div>
      </div>
      <div className="heroart"><img src={photos.hero} alt="Sala Lux de Shisha Lux"/><div className="floating"><b>ENJOY THE LUX MOMENT</b><p>Luces, ambiente y el placer de compartir cada instante.</p></div></div>
    </section>
    <section className="section" id="espacios">
      <div className="sectionhead"><div><div className="eyebrow">ELIGE TU AMBIENTE</div><h2>Un espacio para<br/>cada momento.</h2></div><p>Desde una tarde tranquila en la terraza hasta una noche con amigos en nuestras salas. Encuentra el rincón que encaja contigo.</p></div>
      <div className="grid3">
        <article className="zone"><img src={photos.hero} alt="Sala Lux"/><div className="zonecopy"><small>01 · LOUNGE</small><h3>Sala Lux</h3><p>Ambiente lounge, cócteles y cinco pantallas para disfrutar también de los grandes partidos.</p></div></article>
        <article className="zone"><img src={photos.garden} alt="Terraza Garden Heineken"/><div className="zonecopy"><small>02 · TERRAZA</small><h3>Garden Heineken</h3><p>Un rincón exterior de inspiración exótica para alargar la sobremesa.</p></div></article>
        <article className="zone"><img src={photos.summer} alt="Terraza Summer"/><div className="zonecopy"><small>03 · SUMMER</small><h3>Terraza Summer</h3><p>Terraza abierta para cócteles, batidos y refrescos junto a los tuyos.</p></div></article>
      </div>
    </section>
    <section className="section" id="vip">
      <div className="sectionhead"><div><div className="eyebrow">UN PLAN MÁS PRIVADO</div><h2>Tu grupo. Vuestro<br/>propio espacio.</h2></div><p>Dos salas VIP con personalidad propia y opciones de entretenimiento para convertir cualquier encuentro en un plan especial.</p></div>
      <div className="vipgrid">
        <article className="vip"><img src={photos.vipLarge} alt="Sala VIP Osa Mayor con mesa de billar"/><div className="zonecopy"><small>HASTA 20 PERSONAS</small><h3>Osa Mayor</h3><p>Una sala amplia para compartir y jugar.</p><div className="chips"><span className="chip">Billar</span><span className="chip">Dardos</span><span className="chip">PlayStation 5</span></div></div></article>
        <article className="vip"><img src={photos.vipSmall} alt="Sala VIP Osa Menor"/><div className="zonecopy"><small>HASTA 8 PERSONAS</small><h3>Osa Menor</h3><p>Un ambiente íntimo con sofá, televisión y entretenimiento.</p><div className="chips"><span className="chip">PlayStation 5</span><span className="chip">Futbolín</span><span className="chip">Aire acondicionado</span></div></div></article>
      </div>
      <p style={{color:"#aaa7b5",fontSize:12,marginTop:18}}>Para consultar disponibilidad y condiciones de las salas VIP, contacta directamente con el establecimiento.</p>
    </section>
    <section className="section" id="experiencia">
      <div className="experience"><img src={photos.vipSmall} alt="Ambiente interior de Shisha Lux"/><div><div className="eyebrow">EL UNIVERSO LUX</div><h2>Mucho más que<br/>una salida.</h2><p className="lead">Cachimbas premium, cócteles, batidos y una propuesta gastronómica para acompañar cada encuentro.</p>
      <div className="featurelist"><div className="feature"><b>01 / Cachimbas</b><p>Una experiencia de shisha con diferentes opciones y mezclas.</p></div><div className="feature"><b>02 / Cócteles</b><p>Bebidas y combinaciones para disfrutar sin prisa.</p></div><div className="feature"><b>03 / Gastronomía</b><p>Comida y opciones para compartir.</p></div><div className="feature"><b>04 / Encuentros</b><p>Espacios para venir en pareja, con amigos o en grupo.</p></div></div></div></div>
    </section>
    <section className="ctaBand" id="contacto"><div><div className="eyebrow">NOS VEMOS EN RIVAS</div><h2>El próximo momento<br/>puede ser vuestro.</h2><p>¿Quieres consultar una sala VIP, venir en grupo o resolver alguna duda? El equipo de Shisha Lux te atiende directamente.</p><p style={{fontSize:13}}>Av. Aurelio Álvarez, 7 · 28521 Rivas-Vaciamadrid</p></div><a className="btn" href="https://wa.me/34660461926" target="_blank" rel="noreferrer">Contactar por WhatsApp ↗</a></section>
    <footer className="footer"><div><strong className="brand">SHISHA<span>LUX</span></strong><p>Enjoy the Lux Moment.</p></div><div><strong>Contacto</strong><p>+34 660 46 19 26<br/>hola@shishalux.es</p></div><div><strong>Horario publicado</strong><p>L–J 17:00–01:00 · V 17:00–02:30<br/>S 16:00–02:30 · D 16:00–01:00</p></div></footer>
    <button className="chatLauncher" onClick={() => setOpen(v => !v)}>✦ Asistente Lux</button>
    {open && <aside className="chat">
      <div className="chathead"><div><b>Asistente Shisha Lux</b><small>ASISTENTE INFORMATIVO · DEMOSTRACIÓN</small></div><button onClick={() => setOpen(false)} style={{background:"transparent",color:"white",border:0,fontSize:22,cursor:"pointer"}}>×</button></div>
      <div className="chatbody">{messages.map((m,i)=><div key={i} className={"bubble "+m.role}>{m.text}</div>)}{busy && <div className="bubble bot">Estoy preparando la respuesta…</div>}</div>
      <form className="chatform" onSubmit={send}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Escribe tu pregunta…" aria-label="Tu pregunta"/><button type="submit">Enviar</button></form>
      <div className="notice">Demo informativa. Las reservas online y la conexión con Voiceflow estarán disponibles próximamente.</div>
    </aside>}
  </main>;
}