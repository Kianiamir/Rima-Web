import { db } from "@/db";
import { smsMessages, smsTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendSimpleSms } from "@/lib/sms/smsir";

export type SmsTemplateKey = "NEW_MESSAGE" | (string & {});

type SmsParameter = { name: string; value: string };

export type SendTemplatedSmsResult =
  | { ok: true; sandbox?: boolean }
  | { ok: false; skipped: true }
  | { ok: false; skipped: false; error: string };

function renderBody(body: string, parameters: SmsParameter[]): string {
  let text = body;
  for (const { name, value } of parameters) {
    text = text.split(`{{${name}}}`).join(value);
  }
  return text.replace(/\{\{[A-Z_]+\}\}/g, "").trim();
}

/** متن فعلی قالب؛ null یعنی غیرفعال یا خالی — ارسال رد می‌شود. */
export async function resolveSmsTemplateBody(key: SmsTemplateKey): Promise<string | null> {
  const rows = await db
    .select({ body: smsTemplates.body, isEnabled: smsTemplates.isEnabled })
    .from(smsTemplates)
    .where(eq(smsTemplates.key, key))
    .limit(1);

  const template = rows[0];
  if (template?.isEnabled && template.body.trim().length > 0) {
    return template.body;
  }
  return null;
}

/**
 * ارسال پیامک با متنِ قالبِ پنل مدیریت + ثبت کامل در لاگ.
 * حالت تست (sandbox): فقط در لاگ با وضعیت SANDBOX ثبت می‌شود.
 */
export async function sendTemplatedSms(input: {
  templateKey: SmsTemplateKey;
  phone: string;
  parameters: SmsParameter[];
  purpose?: string;
}): Promise<SendTemplatedSmsResult> {
  const body = await resolveSmsTemplateBody(input.templateKey);

  if (body == null) {
    return { ok: false, skipped: true };
  }

  const { getSmsRuntimeConfig } = await import("@/lib/sms/settings");
  const config = await getSmsRuntimeConfig();

  const inserted = await db
    .insert(smsMessages)
    .values({
      phone: input.phone,
      templateKey: input.templateKey,
      parameters: input.parameters,
      status: "PENDING",
      purpose: input.purpose ?? "",
    })
    .returning();
  const rowId = inserted[0].id;

  if (config.sandbox) {
    await db
      .update(smsMessages)
      .set({ status: "SANDBOX" })
      .where(eq(smsMessages.id, rowId));
    return { ok: true, sandbox: true };
  }

  try {
    const result = await sendSimpleSms({
      mobile: input.phone,
      messageText: renderBody(body, input.parameters),
    });
    const providerMessageId =
      result.data?.messageIds?.[0] != null
        ? String(result.data.messageIds[0])
        : result.data?.packId != null
          ? String(result.data.packId)
          : null;
    await db
      .update(smsMessages)
      .set({ status: "SENT", providerMessageId })
      .where(eq(smsMessages.id, rowId));
    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    await db
      .update(smsMessages)
      .set({ status: "FAILED", error })
      .where(eq(smsMessages.id, rowId));
    return { ok: false, skipped: false, error };
  }
}

/** اطلاع‌رسانی «پیام جدید فرم تماس» به موبایل مدیر. */
export async function sendNewMessageSms(input: { name: string; text: string }) {
  const { getSmsRuntimeConfig } = await import("@/lib/sms/settings");
  const config = await getSmsRuntimeConfig();
  if (!config.notifyPhone) {
    return { ok: false, skipped: true };
  }

  const excerpt =
    input.text.length > 60 ? `${input.text.slice(0, 60).trimEnd()}…` : input.text;

  return sendTemplatedSms({
    templateKey: "NEW_MESSAGE",
    phone: config.notifyPhone,
    parameters: [
      { name: "NAME", value: input.name },
      { name: "TEXT", value: excerpt },
    ],
    purpose: "TRANSACTIONAL",
  });
}
