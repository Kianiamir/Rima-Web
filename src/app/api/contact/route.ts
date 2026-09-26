import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { messages } from "@/db/schema";

const contactSchema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید").max(120),
  email: z.string().trim().email("ایمیل معتبر نیست"),
  phone: z.string().trim().max(40).optional().default(""),
  body: z.string().trim().min(10, "متن پیام خیلی کوتاه است").max(5000),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" },
      { status: 400 },
    );
  }

  await db.insert(messages).values(parsed.data);
  return NextResponse.json({ ok: true });
}
