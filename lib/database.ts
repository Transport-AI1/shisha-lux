import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Falta DATABASE_URL_POOLED o DATABASE_URL. Configura la conexión de Neon en las variables de entorno.",
  );
}

export const sql = neon(connectionString);

let schemaPromise: Promise<void> | undefined;

export function ensureReviewsSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS menu_reviews (
          id BIGSERIAL PRIMARY KEY,
          item_name VARCHAR(160) NOT NULL,
          category_name VARCHAR(100) NOT NULL,
          reviewer_name VARCHAR(80) NOT NULL,
          rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          comment VARCHAR(600) NOT NULL DEFAULT '',
          status VARCHAR(16) NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'approved', 'rejected')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS menu_reviews_public_lookup
        ON menu_reviews (status, category_name, item_name)
      `;
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }

  return schemaPromise;
}
