import "dotenv/config";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { adminUsers, projects, smsTemplates } from "../src/db/schema";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@rimaweb.ir";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "rimaweb-admin";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "مدیر ریماوب";

const SAMPLE_PROJECTS = [
  {
    slug: "luxury-barber",
    title: "آرایشگاه لاکچری",
    category: "رزرو آنلاین",
    summary: "وب‌سایت رزرو نوبت با پنل مدیریت کامل",
    description:
      "سیستم رزرو نوبت آنلاین برای یک آرایشگاه مردانه لاکچری:\n• انتخاب آرایشگر و زمان خالی در تقویم شمسی\n• پنل مدیریت نوبت‌ها و مشتریان\n• یادآوری پیامکی نوبت\n• طراحی اختصاصی هماهنگ با هویت برند",
    link: "",
    year: "۱۴۰۴",
    tags: "Next.js, رزرو آنلاین, آرایشگاه",
    coverGradient: "linear-gradient(160deg, #4F46E5, #818CF8)",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "online-academy",
    title: "آکادمی آموزش آنلاین",
    category: "فروشگاه",
    summary: "فروشگاه دوره‌های تخصصی با درگاه پرداخت",
    description:
      "فروشگاه آنلاین دوره‌های آموزشی:\n• معرفی و پیش‌نمایش دوره‌ها\n• پرداخت آنلاین و دسترسی فوری\n• پنل مدیریت دوره‌ها و سفارش‌ها\n• سئوی قوی برای جذب ترافیک ارگانیک",
    link: "",
    year: "۱۴۰۴",
    tags: "فروشگاه آنلاین, درگاه پرداخت, آموزش",
    coverGradient: "linear-gradient(160deg, #F59E0B, #FBBF24)",
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "real-estate-agency",
    title: "آژانس املاک",
    category: "سامانه",
    summary: "سامانه رزرو و مدیریت ملک",
    description:
      "سامانه جامع مدیریت املاک:\n• کاتالوگ ملک‌ها با فیلتر پیشرفته\n• رزرو بازدید حضوری آنلاین\n• پنل مدیریت فایل‌ها و مشتریان\n• گزارش‌گیری وضعیت معاملات",
    link: "",
    year: "۱۴۰۳",
    tags: "املاک, سامانه, رزرو",
    coverGradient: "linear-gradient(160deg, #3730A3, #4F46E5)",
    featured: true,
    sortOrder: 3,
  },
];

async function main() {
  // Admin account (idempotent).
  const existing = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, ADMIN_EMAIL))
    .limit(1);
  if (existing.length === 0) {
    const passwordHash = await hash(ADMIN_PASSWORD);
    await db.insert(adminUsers).values({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
    });
    console.log(`✓ admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log(`• admin already exists: ${ADMIN_EMAIL}`);
  }

  // Sample projects (idempotent by slug).
  for (const p of SAMPLE_PROJECTS) {
    const rows = await db.select().from(projects).where(eq(projects.slug, p.slug)).limit(1);
    if (rows.length === 0) {
      await db.insert(projects).values(p);
      console.log(`✓ project seeded: ${p.title}`);
    }
  }

  // Built-in SMS templates (idempotent by key).
  const BUILT_IN_SMS_TEMPLATES = [
    {
      key: "NEW_MESSAGE",
      label: "پیام جدید فرم تماس",
      body: "ریماوب\nپیام جدید از فرم تماس:\nاز: {{NAME}}\n{{TEXT}}",
      description:
        "وقتی بازدیدکننده‌ای فرم تماس را پر کند، این پیامک به «موبایل مدیر» در تنظیمات می‌رود.",
    },
  ];
  for (const t of BUILT_IN_SMS_TEMPLATES) {
    const rows = await db
      .select({ id: smsTemplates.id })
      .from(smsTemplates)
      .where(eq(smsTemplates.key, t.key))
      .limit(1);
    if (rows.length === 0) {
      await db.insert(smsTemplates).values({ ...t, isBuiltIn: true });
      console.log(`✓ sms template seeded: ${t.key}`);
    }
  }

  console.log("seed done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit(0));
