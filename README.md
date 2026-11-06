# Shisha Lux — demo de Transport AI

Web de demostración para Shisha Lux, Rivas-Vaciamadrid.

Incluye una web responsive con fotografías de la web oficial, secciones de Sala Lux, terrazas, salas VIP y experiencia, además de un asistente informativo de demostración.

El asistente responde con información guiada y deja claro que la reserva automática y la integración de Voiceflow son futuras, no funciones activas.

## Desarrollo
npm install
npm run dev

## Producción
npm run build

Antes de publicar una web comercial definitiva, confirmar autorización de uso de las fotografías con Shisha Lux.

## Base de datos y valoraciones (Neon)

La carta sigue mostrando el catálogo actual y ahora consulta las valoraciones públicas en Neon. Las nuevas reseñas se guardan como **pendientes** hasta que el equipo las revise; solo las aprobadas aparecen en la web.

### Variables de entorno

En Vercel → Settings → Environment Variables, configura:

- `DATABASE_URL_POOLED`: cadena pooled de Neon (host que incluye `-pooler`). Es la conexión utilizada por la API.
- `DATABASE_URL`: cadena directa de Neon (opcional, reservada para tareas administrativas).

Para desarrollo local, copia `.env.example` a `.env.local` y sustituye los valores por las cadenas reales. Nunca subas `.env.local` ni compartas las contraseñas.

### Moderación de reseñas

La API crea la tabla `menu_reviews` automáticamente en su primer uso. También está disponible el SQL en `docs/neon-reviews.sql`.

En Neon → SQL Editor puedes revisar las reseñas pendientes:

```sql
SELECT id, item_name, category_name, reviewer_name, rating, comment, created_at
FROM menu_reviews
WHERE status = 'pending'
ORDER BY created_at DESC;
```

Para publicar una reseña después de comprobarla:

```sql
UPDATE menu_reviews SET status = 'approved' WHERE id = ID_DE_LA_RESEÑA;
```

La web solo muestra medias y recuentos de reseñas aprobadas. No se muestran nombres ni comentarios públicamente en esta primera versión.
