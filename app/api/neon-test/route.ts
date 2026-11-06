import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return NextResponse.json({ connected: false, error: "DATABASE_URL is not configured" }, { status: 500 });
  }

  try {
    const sql = neon(connectionString);
    const result = await sql`SELECT NOW() AS server_time`;
    return NextResponse.json({ connected: true, serverTime: result[0]?.server_time });
  } catch {
    return NextResponse.json({ connected: false, error: "Database connection failed" }, { status: 500 });
  }
}
