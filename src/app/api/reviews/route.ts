import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const db = readDb();
  if (!db.reviews) db.reviews = [];

  if (productId) {
    const productReviews = db.reviews.filter((r: any) => r.productId === productId);
    return NextResponse.json(productReviews);
  }
  return NextResponse.json(db.reviews);
}

export async function POST(req: Request) {
  const review = await req.json();
  const db = readDb();
  if (!db.reviews) db.reviews = [];

  review.id = Date.now().toString();
  review.date = new Date().toISOString();
  db.reviews.push(review);
  writeDb(db);

  return NextResponse.json({ success: true, review });
}
