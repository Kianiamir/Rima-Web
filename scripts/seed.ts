import "dotenv/config";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { adminUsers, projects } from "../src/db/schema";

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
    coverGradient: "radial-gradient(300px 200px at 20% 0%, rgba(124,108,255,.8), #1B1F33)",
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
    coverGradient: "radial-gradient(300px 200px at 80% 10%, rgba(45,212,191,.55), #14232B)",
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
    coverGradient: "radial-gradient(300px 200px at 50% 100%, rgba(167,139,250,.6), #1B1B2E)",
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

  console.log("seed done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit(0));
