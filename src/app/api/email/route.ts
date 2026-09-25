import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import fs from "fs";
import path from "path";

const emailLogPath = path.join(process.cwd(), "data", "email_log.json");

export async function POST(req: Request) {
  const { email, orderId, total, items } = await req.json();

  // Mock: just save to a log file (no real email sent)
  let logs: any[] = [];
  if (fs.existsSync(emailLogPath)) {
    logs = JSON.parse(fs.readFileSync(emailLogPath, "utf8"));
  }

  logs.push({
    sentAt: new Date().toISOString(),
    to: email,
    orderId,
    total,
    itemCount: items?.length || 0,
    status: "MOCK_SENT",
  });

  fs.writeFileSync(emailLogPath, JSON.stringify(logs, null, 2));

  return NextResponse.json({ success: true, message: `Email ${email} ga yuborildi (mock)` });
}
