"use server";

import { revalidatePath } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { smsMessages, smsSettings, smsTemplates } from "@/db/schema";
import { requireAdmin } from "@/modules/auth/session";
import { sendTemplatedSms } from "@/lib/sms/send";
import {
  smsConnectionSchema,
  smsTemplateEditSchema,
  smsTemplateSchema,
  smsTestSendSchema,
} from "@/modules/sms/validations";

export type SmsSettingsView = {
  hasApiKey: boolean;
  apiKeyLast4: string | null;
  apiKeyFromEnv: boolean;
  senderNumber: string;
  notifyPhone: string;
  sandbox: boolean;
};

export type SmsTemplateRow = {
  id: number;
  key: string;
  label: string;
  body: string;
  isEnabled: boolean;
  isBuiltIn: boolean;
  description: string;
};

export type SmsLogRow = {
  id: number;
  phone: string;
  templateKey: string;
  status: string;
  error: string | null;
  createdAt: Date;
};

export type ActionResult = { ok: boolean; message?: string };

function revalidateSms() {
  revalidatePath("/admin/sms");
}

async function getSettingsRow() {
  const rows = await db
    .select()
    .from(smsSettings)
    .orderBy(asc(smsSettings.createdAt))
    .limit(1);
  if (rows[0]) return rows[0];
  const inserted = await db.insert(smsSettings).values({}).returning();
  return inserted[0];
}

export async function getSmsSettingsView(): Promise<SmsSettingsView> {
  await requireAdmin();

  const [row, envKey] = await Promise.all([
    getSettingsRow(),
    Promise.resolve(process.env.SMSIR_API_KEY ?? null),
  ]);

  const apiKey = row.apiKey ?? envKey;
  return {
    hasApiKey: Boolean(apiKey),
    apiKeyLast4: apiKey ? apiKey.slice(-4) : null,
    apiKeyFromEnv: !row.apiKey && Boolean(envKey),
    senderNumber: row.senderNumber,
    notifyPhone: row.notifyPhone,
    sandbox: row.sandbox,
  };
}

export async function updateSmsSettings(values: {
  apiKey?: string;
  senderNumber?: string;
  notifyPhone?: string;
  sandbox?: boolean;
}): Promise<ActionResult> {
  await requireAdmin();

  const parsed = smsConnectionSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };
  }

  const settings = await getSettingsRow();
  const data = parsed.data;

  await db
    .update(smsSettings)
    .set({
      apiKey: data.apiKey?.trim() ? data.apiKey.trim() : settings.apiKey,
      senderNumber: data.senderNumber ?? "",
      notifyPhone: data.notifyPhone ?? "",
      sandbox: data.sandbox ?? false,
      updatedAt: new Date(),
    })
    .where(eq(smsSettings.id, settings.id));

  revalidateSms();
  return { ok: true, message: "تنظیمات پیامک ذخیره شد" };
}

/** استعلام اعتبار باقی‌ماندهٔ سامانهٔ پیامکی. */
export async function getSmsCredit(): Promise<{
  ok: boolean;
  credit: number | null;
  error: string | null;
}> {
  await requireAdmin();

  try {
    const { getCredit } = await import("@/lib/sms/smsir");
    const credit = await getCredit();
    return { ok: true, credit, error: null };
  } catch (error) {
    return {
      ok: false,
      credit: null,
      error: error instanceof Error ? error.message : "استعلام اعتبار ناموفق بود",
    };
  }
}

export async function listSmsTemplates(): Promise<SmsTemplateRow[]> {
  await requireAdmin();

  return db
    .select({
      id: smsTemplates.id,
      key: smsTemplates.key,
      label: smsTemplates.label,
      body: smsTemplates.body,
      isEnabled: smsTemplates.isEnabled,
      isBuiltIn: smsTemplates.isBuiltIn,
      description: smsTemplates.description,
    })
    .from(smsTemplates)
    .orderBy(desc(smsTemplates.isBuiltIn), asc(smsTemplates.createdAt));
}

export async function updateSmsTemplate(
  id: number,
  values: { label: string; body: string; description?: string },
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = smsTemplateEditSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };
  }

  const rows = await db
    .select({ id: smsTemplates.id })
    .from(smsTemplates)
    .where(eq(smsTemplates.id, id))
    .limit(1);
  if (!rows[0]) return { ok: false, message: "قالب یافت نشد" };

  await db.update(smsTemplates).set(parsed.data).where(eq(smsTemplates.id, id));
  revalidateSms();
  return { ok: true, message: "قالب ذخیره شد" };
}

export async function toggleSmsTemplate(id: number, isEnabled: boolean): Promise<ActionResult> {
  await requireAdmin();

  await db.update(smsTemplates).set({ isEnabled }).where(eq(smsTemplates.id, id));
  revalidateSms();
  return { ok: true, message: isEnabled ? "قالب فعال شد" : "قالب غیرفعال شد" };
}

export async function createSmsTemplate(values: {
  key: string;
  label: string;
  body: string;
  description?: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const parsed = smsTemplateSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" };
  }

  const clash = await db
    .select({ id: smsTemplates.id })
    .from(smsTemplates)
    .where(eq(smsTemplates.key, parsed.data.key))
    .limit(1);
  if (clash[0]) return { ok: false, message: "قالبی با این کلید وجود دارد" };

  await db.insert(smsTemplates).values({ ...parsed.data, isBuiltIn: false });
  revalidateSms();
  return { ok: true, message: "قالب ساخته شد" };
}

export async function deleteSmsTemplate(id: number): Promise<ActionResult> {
  await requireAdmin();

  const rows = await db
    .select({ isBuiltIn: smsTemplates.isBuiltIn })
    .from(smsTemplates)
    .where(eq(smsTemplates.id, id))
    .limit(1);
  if (!rows[0]) return { ok: false, message: "قالب یافت نشد" };
  if (rows[0].isBuiltIn) {
    return { ok: false, message: "قالب‌های سیستمی قابل حذف نیستند؛ می‌توانید غیرفعالشان کنید" };
  }

  await db.delete(smsTemplates).where(eq(smsTemplates.id, id));
  revalidateSms();
  return { ok: true, message: "قالب حذف شد" };
}

export async function listRecentSms(limit = 20): Promise<SmsLogRow[]> {
  await requireAdmin();

  return db
    .select({
      id: smsMessages.id,
      phone: smsMessages.phone,
      templateKey: smsMessages.templateKey,
      status: smsMessages.status,
      error: smsMessages.error,
      createdAt: smsMessages.createdAt,
    })
    .from(smsMessages)
    .orderBy(desc(smsMessages.createdAt))
    .limit(limit);
}

/** ارسال آزمایشی از پنل برای اطمینان از اتصال و قالب. */
export async function sendTestSms(values: {
  phone: string;
  templateKey: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const parsed = smsTestSendSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "شماره معتبر نیست" };
  }

  const result = await sendTemplatedSms({
    templateKey: parsed.data.templateKey,
    phone: `0${parsed.data.phone}`,
    parameters: [],
    purpose: "TEST",
  });

  revalidateSms();

  if (result.ok) {
    return {
      ok: true,
      message: result.sandbox ? "حالت تست: پیامک فقط در گزارش ثبت شد" : "پیامک آزمایشی ارسال شد",
    };
  }
  if (result.skipped) {
    return { ok: false, message: "این قالب غیرفعال یا خالی است" };
  }
  return { ok: false, message: result.error };
}
