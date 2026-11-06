import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL no está configurada" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(connectionString);
    const rows = await sql`SELECT NOW() AS server_time`;
    return NextResponse.json({ ok: true, serverTime: rows[0]?.server_time });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo conectar con la base de datos" },
      { status: 500 }
    );
  }
}
