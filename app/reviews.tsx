"use client";

import { FormEvent, useEffect, useState } from "react";

type Review = { id: number; name: string; rating: number; comment: string; created_at: string };
type Data = { total: number; average: number };

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Data>({ total: 0, average: 0 });
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      const data = await response.json();
      if (data.ok) { setReviews(data.reviews); setSummary(data.summary); }
    } catch { setMessage("No se pudieron cargar las valoraciones."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true); setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo enviar.");
      setReviews(current => [data.review, ...current].slice(0, 30));
      setSummary(current => ({ total: current.total + 1, average: Number((((current.average * current.total) + rating) / (current.total + 1)).toFixed(1)) }));
      setName(""); setComment(""); setRating(5);
      setMessage("¡Gracias! Tu valoración se ha publicado.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Error al enviar."); }
    finally { setSending(false); }
  }

  return <div className="reviews-wrap">
    <div className="reviews-heading">
      <div><div className="eyebrow">LO QUE OPINÁIS</div><h2>Vuestra experiencia<br/>también cuenta.</h2><p>Comparte tu visita y ayuda a otros a descubrir Shisha Lux.</p></div>
      <div className="reviews-score"><strong>{summary.average.toFixed(1)}</strong><span className="review-stars">★★★★★</span><small>{summary.total} valoraciones</small></div>
    </div>
    <div className="reviews-layout">
      <form className="review-form" onSubmit={submit}>
        <h3>Deja tu valoración</h3>
        <label>Tu nombre<input value={name} onChange={e=>setName(e.target.value)} maxLength={60} required placeholder="Cómo te llamamos"/></label>
        <label>Tu puntuación<div className="rating-picker" role="radiogroup" aria-label="Puntuación">{[1,2,3,4,5].map(n=><button type="button" key={n} aria-label={n+" estrellas"} aria-pressed={rating===n} onClick={()=>setRating(n)} className={n<=rating?"active":""}>★</button>)}</div></label>
        <label>Cuéntanos tu experiencia<textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength={500} required rows={4} placeholder="¿Qué fue lo que más te gustó?"/></label>
        <button className="btn" disabled={sending}>{sending?"Enviando…":"Publicar valoración ↗"}</button>
        {message&&<p className="review-message" role="status">{message}</p>}
        <small className="review-privacy">Al publicar, aceptas que tu nombre y comentario se muestren en esta web.</small>
      </form>
      <div className="review-list">
        {loading?<p className="review-empty">Cargando valoraciones…</p>:reviews.length===0?<p className="review-empty">Aún no hay valoraciones. ¡Sé la primera persona en compartir su experiencia!</p>:reviews.map(review=><article className="review-card" key={review.id}><div className="review-card-top"><b>{review.name}</b><span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div><p>{review.comment}</p><small>{new Date(review.created_at).toLocaleDateString("es-ES")}</small></article>)}
      </div>
    </div>
  </div>;
}
