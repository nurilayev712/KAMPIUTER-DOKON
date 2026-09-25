import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { readDb, writeDb } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "upg-rade-super-secret-key-2026"
);

export async function POST(req: Request) {
  const { login, password, action } = await req.json();

  const db = readDb();
  if (!db.users) db.users = [];

  if (action === "register") {
    const exists = db.users.find((u: any) => u.login === login);
    if (exists) return NextResponse.json({ error: "Bu login allaqachon mavjud" }, { status: 400 });

    db.users.push({ login, password, createdAt: new Date().toISOString() });
    writeDb(db);
  }

  // Check credentials
  const isAdmin = login === "nurilayev712" && password === "admin712";
  const user = db.users.find((u: any) => u.login === login && u.password === password);

  if (!isAdmin && !user) {
    return NextResponse.json({ error: "Login yoki parol xato" }, { status: 401 });
  }

  // Sign JWT
  const token = await new SignJWT({ login, isAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const response = NextResponse.json({ success: true, login, isAdmin });
  response.cookies.set("upg_token", token, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}

export async function DELETE() {
  // Logout
  const response = NextResponse.json({ success: true });
  response.cookies.delete("upg_token");
  return response;
}
