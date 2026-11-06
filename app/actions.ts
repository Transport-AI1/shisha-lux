"use server";

import { neon } from "@neondatabase/serverless";

export async function getData() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Falta configurar DATABASE_URL en las variables de entorno.");
  }

  const sql = neon(connectionString);
  const data = await sql`SELECT NOW() AS server_time`;

  return data;
}
