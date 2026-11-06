import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está configurada");
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS shisha_lux_menu_ratings (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(60) NOT NULL,
    item_name VARCHAR(160) NOT NULL,
    user_id TEXT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`ALTER TABLE shisha_lux_menu_ratings ADD COLUMN IF NOT EXISTS user_id TEXT`;
  // Ratings submitted before accounts existed were test votes; clear them once during migration.
  await sql`DELETE FROM shisha_lux_menu_ratings WHERE user_id IS NULL`;
  await sql`ALTER TABLE shisha_lux_menu_ratings ALTER COLUMN user_id SET NOT NULL`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS shisha_lux_menu_ratings_one_vote_per_user ON shisha_lux_menu_ratings (category, item_name, user_id)`;
  return sql;
}

export async function GET() {
  try {
    const sql = await getSql();
    const rows = await sql`SELECT category, item_name, ROUND(AVG(rating)::numeric, 1)::float AS average, COUNT(*)::int AS count FROM shisha_lux_menu_ratings GROUP BY category, item_name`;
    const ratings: Record<string, { average: number; count: number }> = {};
    for (const row of rows) ratings[`${row.category}:${row.item_name}`] = { average: Number(row.average), count: Number(row.count) };
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email ?? null;
    let myRatings: Record<string, number> = {};
    if (userId) {
      const mine = await sql`SELECT category, item_name, rating FROM shisha_lux_menu_ratings WHERE user_id = ${userId}`;
      for (const row of mine) myRatings[`${row.category}:${row.item_name}`] = Number(row.rating);
    }
    return NextResponse.json({ ok: true, ratings, myRatings, signedIn: Boolean(userId) });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudieron cargar las valoraciones" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email;
    if (!userId) return NextResponse.json({ ok: false, error: "Inicia sesión para valorar un plato." }, { status: 401 });
    const body = await request.json();
    const category = typeof body.category === "string" ? body.category.trim().slice(0, 60) : "";
    const item = typeof body.item === "string" ? body.item.trim().slice(0, 160) : "";
    const rating = Number(body.rating);
    if (!category || !item || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "Selecciona una valoración de 1 a 5 estrellas." }, { status: 400 });
    }
    const sql = await getSql();
    const inserted = await sql`INSERT INTO shisha_lux_menu_ratings (category, item_name, user_id, rating) VALUES (${category}, ${item}, ${userId}, ${rating}) ON CONFLICT (category, item_name, user_id) DO NOTHING RETURNING id`;
    if (inserted.length === 0) return NextResponse.json({ ok: false, error: "Ya has valorado este plato. Solo se permite una valoración por cuenta." }, { status: 409 });
    const [summary] = await sql`SELECT ROUND(AVG(rating)::numeric, 1)::float AS average, COUNT(*)::int AS count FROM shisha_lux_menu_ratings WHERE category = ${category} AND item_name = ${item}`;
    return NextResponse.json({ ok: true, rating: { average: Number(summary.average), count: Number(summary.count) } }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo guardar la valoración." }, { status: 500 });
  }
}
