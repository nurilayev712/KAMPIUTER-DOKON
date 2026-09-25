import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "upg-rade-super-secret-key-2026"
);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("upg_token")?.value;

  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true, login: payload.login, isAdmin: payload.isAdmin });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
