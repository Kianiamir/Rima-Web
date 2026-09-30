import { db } from "@/db";
import { smsSettings } from "@/db/schema";
import { asc } from "drizzle-orm";

export type SmsRuntimeConfig = {
  apiKey: string | null;
  senderNumber: string | null;
  /** شمارهٔ موبایل مدیر — مقصد پیامک‌های اطلاع‌رسانی سایت. */
  notifyPhone: string | null;
  sandbox: boolean;
  /** آیا تنظیمات از پنل مدیریت ثبت شده است (وگرنه مقدار env فعال است). */
  configuredInPanel: boolean;
};

/**
 * تنظیمات runtime سامانهٔ پیامکی: اولویت با پنل مدیریت (دیتابیس) است و
 * در نبود آن، متغیرهای env سرور استفاده می‌شوند.
 */
export async function getSmsRuntimeConfig(): Promise<SmsRuntimeConfig> {
  const rows = await db.select().from(smsSettings).orderBy(asc(smsSettings.createdAt)).limit(1);
  const settings = rows[0];

  if (settings) {
    return {
      apiKey: settings.apiKey ?? process.env.SMSIR_API_KEY ?? null,
      senderNumber: settings.senderNumber.trim() || null,
      notifyPhone: settings.notifyPhone.trim() || null,
      sandbox: settings.sandbox,
      configuredInPanel: true,
    };
  }

  return {
    apiKey: process.env.SMSIR_API_KEY ?? null,
    senderNumber: null,
    notifyPhone: null,
    sandbox: false,
    configuredInPanel: false,
  };
}
