import { z } from "zod";
import { normalizeMobile } from "@/lib/sms/smsir";

/** موبایل ایران: با ۰۹، ۹۸۹ یا ۹ شروع می‌شود → نرمال و معتبر. */
export const iranMobileSchema = z
  .string()
  .trim()
  .transform((v) => normalizeMobile(v))
  .refine((v) => /^9\d{9}$/.test(v), "شمارهٔ موبایل معتبر نیست");

export const smsConnectionSchema = z.object({
  apiKey: z.string().trim().max(200).optional(),
  senderNumber: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^\d{6,20}$/.test(v), "شمارهٔ سامانه معتبر نیست"),
  notifyPhone: z.union([iranMobileSchema, z.literal("")]).optional(),
  sandbox: z.boolean().optional().default(false),
});

export const smsTemplateSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[A-Z][A-Z0-9_]{1,58}$/, "کلید فقط حروف بزرگ انگلیسی، عدد و _"),
  label: z.string().trim().min(2, "عنوان را وارد کنید").max(120),
  body: z
    .string()
    .trim()
    .min(5, "متن پیامک خیلی کوتاه است")
    .max(500, "متن پیامک خیلی بلند است"),
  description: z.string().trim().max(300).optional().default(""),
});

export const smsTemplateEditSchema = smsTemplateSchema.omit({ key: true });

export const smsTestSendSchema = z.object({
  phone: iranMobileSchema,
  templateKey: z.string().trim().min(2).max(60),
});
