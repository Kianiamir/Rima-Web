import { getSmsRuntimeConfig } from "@/lib/sms/settings";

const SMSIR_API_BASE = "https://api.sms.ir/v1";

type SmsIrSendResponse = {
  status: number;
  message: string;
  data?: {
    packId?: number;
    messageIds?: number[];
    cost?: number;
  };
};

/** «+98 912 …» / «۰۹۱۲…» → «912…» (the format sms.ir expects). */
export function normalizeMobile(phone: string): string {
  const digits = phone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, "");
  if (digits.startsWith("98")) return digits.slice(2);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

async function loadApiKey(): Promise<string> {
  const config = await getSmsRuntimeConfig();
  if (!config.apiKey) {
    throw new Error("کلید API سامانهٔ پیامکی تنظیم نشده است");
  }
  return config.apiKey;
}

/** ارسال با شمارهٔ سامانه — متن آزاد؛ متن از قالب‌های پنل مدیریت می‌آید. */
export async function sendSimpleSms(input: { mobile: string; messageText: string }) {
  const config = await getSmsRuntimeConfig();
  const lineNumber = config.senderNumber;
  if (!lineNumber) {
    throw new Error("شمارهٔ سامانهٔ پیامکی در تنظیمات وارد نشده است");
  }

  const response = await fetch(`${SMSIR_API_BASE}/sms/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
      "x-api-key": await loadApiKey(),
    },
    body: JSON.stringify({
      lineNumber,
      messageText: input.messageText,
      mobiles: [normalizeMobile(input.mobile)],
    }),
  });

  const result = (await response.json()) as SmsIrSendResponse;

  if (!response.ok || result.status !== 1) {
    throw new Error(result.message || "خطا در ارسال پیامک");
  }

  return result;
}

/** استعلام اعتبار باقی‌ماندهٔ سامانه (تعداد پیامک). */
export async function getCredit(): Promise<number> {
  const response = await fetch(`${SMSIR_API_BASE}/credit`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": await loadApiKey(),
    },
  });

  const result = (await response.json()) as
    | { status: number; message: string; data?: { credit?: number } }
    | { status: number; message: string };

  if (!response.ok || result.status !== 1) {
    throw new Error(result.message || "استعلام اعتبار ناموفق بود");
  }

  const credit = "data" in result ? result.data?.credit : undefined;
  if (credit == null) {
    throw new Error("اعتبار دریافت نشد");
  }
  return credit;
}
