import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.products);
}

export async function POST(req: Request) {
  const product = await req.json();
  const db = readDb();
  db.products.push(product);
  writeDb(db);
  return NextResponse.json({ success: true, product });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  
  const db = readDb();
  db.products = db.products.filter((p: any) => p.id !== id);
  writeDb(db);
  
  return NextResponse.json({ success: true });
}
