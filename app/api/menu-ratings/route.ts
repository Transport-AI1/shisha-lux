import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está configurada");
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS shisha_lux_menu_ratings (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(60) NOT NULL,
    item_name VARCHAR(160) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  return sql;
}

export async function GET() {
  try {
    const sql = await getSql();
    const rows = await sql`SELECT category, item_name, ROUND(AVG(rating)::numeric, 1)::float AS average, COUNT(*)::int AS count FROM shisha_lux_menu_ratings GROUP BY category, item_name`;
    const ratings: Record<string, { average: number; count: number }> = {};
    for (const row of rows) ratings[`${row.category}:${row.item_name}`] = { average: Number(row.average), count: Number(row.count) };
    return NextResponse.json({ ok: true, ratings });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudieron cargar las valoraciones" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = typeof body.category === "string" ? body.category.trim().slice(0, 60) : "";
    const item = typeof body.item === "string" ? body.item.trim().slice(0, 160) : "";
    const rating = Number(body.rating);
    if (!category || !item || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "Selecciona una valoración de 1 a 5 estrellas." }, { status: 400 });
    }
    const sql = await getSql();
    await sql`INSERT INTO shisha_lux_menu_ratings (category, item_name, rating) VALUES (${category}, ${item}, ${rating})`;
    const [summary] = await sql`SELECT ROUND(AVG(rating)::numeric, 1)::float AS average, COUNT(*)::int AS count FROM shisha_lux_menu_ratings WHERE category = ${category} AND item_name = ${item}`;
    return NextResponse.json({ ok: true, rating: { average: Number(summary.average), count: Number(summary.count) } }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo guardar la valoración." }, { status: 500 });
  }
}
