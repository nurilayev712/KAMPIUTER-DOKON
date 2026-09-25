import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  if (!db.callbacks) db.callbacks = [];
  return NextResponse.json(db.callbacks);
}

export async function POST(req: Request) {
  const { phone, name } = await req.json();
  const db = readDb();
  if (!db.callbacks) db.callbacks = [];

  const newCallback = {
    id: Date.now().toString(),
    name,
    phone,
    date: new Date().toISOString(),
    status: "new"
  };

  db.callbacks.push(newCallback);
  writeDb(db);

  return NextResponse.json({ success: true, callback: newCallback });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const db = readDb();
  const idx = db.callbacks.findIndex((c: any) => c.id === id);
  if (idx !== -1) {
    db.callbacks[idx].status = status;
    writeDb(db);
  }
  return NextResponse.json({ success: true });
}
