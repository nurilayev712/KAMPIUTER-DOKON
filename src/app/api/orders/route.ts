import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  const db = readDb();
  if (user) {
    const userOrders = db.orders.filter((o: any) => o.user === user);
    return NextResponse.json(userOrders);
  }
  return NextResponse.json(db.orders);
}

export async function POST(req: Request) {
  const order = await req.json();
  const db = readDb();
  db.orders.push(order);
  writeDb(db);
  return NextResponse.json({ success: true, order });
}

export async function PATCH(req: Request) {
  // Update order status (for admin order tracking)
  const { id, status } = await req.json();
  const db = readDb();
  const idx = db.orders.findIndex((o: any) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.orders[idx].status = status;
  writeDb(db);
  return NextResponse.json({ success: true, order: db.orders[idx] });
}
