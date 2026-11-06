import { NextRequest, NextResponse } from "next/server";
import { ensureReviewsSchema, sql } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureReviewsSchema();
    const ratings = await sql`
      SELECT
        item_name,
        category_name,
        ROUND(AVG(rating)::numeric, 1)::float AS average_rating,
        COUNT(*)::int AS review_count
      FROM menu_reviews
      WHERE status = 'approved'
      GROUP BY item_name, category_name
    `;

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error al consultar valoraciones:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las valoraciones." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureReviewsSchema();
    const body = await request.json();

    const itemName =
      typeof body.itemName === "string" ? body.itemName.trim() : "";
    const categoryName =
      typeof body.categoryName === "string" ? body.categoryName.trim() : "";
    const reviewerName =
      typeof body.reviewerName === "string" ? body.reviewerName.trim() : "";
    const comment =
      typeof body.comment === "string" ? body.comment.trim() : "";
    const rating = Number(body.rating);

    if (
      !itemName ||
      itemName.length > 160 ||
      !categoryName ||
      categoryName.length > 100 ||
      !reviewerName ||
      reviewerName.length > 80 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      comment.length > 600
    ) {
      return NextResponse.json(
        { error: "Revisa los datos: nombre, producto, puntuación y comentario." },
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO menu_reviews
        (item_name, category_name, reviewer_name, rating, comment, status)
      VALUES
        (${itemName}, ${categoryName}, ${reviewerName}, ${rating}, ${comment}, 'pending')
    `;

    return NextResponse.json(
      { message: "¡Gracias! Tu valoración se ha enviado y está pendiente de revisión." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al guardar valoración:", error);
    return NextResponse.json(
      { error: "No se pudo enviar la valoración. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}
