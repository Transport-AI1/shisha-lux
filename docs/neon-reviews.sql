-- Shisha Lux: tabla de valoraciones de la carta.
-- La API también crea esta tabla automáticamente en el primer uso.
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
);

CREATE INDEX IF NOT EXISTS menu_reviews_public_lookup
ON menu_reviews (status, category_name, item_name);

-- Revisar valoraciones pendientes:
SELECT id, item_name, category_name, reviewer_name, rating, comment, created_at
FROM menu_reviews
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Publicar una valoración después de revisarla:
-- UPDATE menu_reviews SET status = 'approved' WHERE id = 1;
