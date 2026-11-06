import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está configurada");
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS shisha_lux_reviews (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(60) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  return sql;
}

export async function GET() {
  try {
    const sql = await getSql();
    const [summary] = await sql`SELECT COUNT(*)::int AS total, COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::float AS average FROM shisha_lux_reviews`;
    const reviews = await sql`SELECT id, customer_name AS name, rating, comment, created_at FROM shisha_lux_reviews ORDER BY created_at DESC LIMIT 30`;
    return NextResponse.json({ ok: true, summary, reviews });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudieron cargar las valoraciones" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
    const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 500) : "";
    const rating = Number(body.rating);
    if (!name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "Indica tu nombre, una valoración de 1 a 5 y un comentario." }, { status: 400 });
    }
    const sql = await getSql();
    const [review] = await sql`INSERT INTO shisha_lux_reviews (customer_name, rating, comment) VALUES (${name}, ${rating}, ${comment}) RETURNING id, customer_name AS name, rating, comment, created_at`;
    return NextResponse.json({ ok: true, review }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo guardar tu valoración. Inténtalo de nuevo." }, { status: 500 });
  }
}
