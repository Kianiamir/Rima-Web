# ریماوب — وب‌سایت شخصی طراح وب

وب‌سایت پورتفولیو + پنل مدیریت، ساخته‌شده با Next.js 16، React 19، Tailwind 4 و Drizzle ORM.

## امکانات

- **صفحات سایت:** خانه، نمونه‌کارها (لیست + صفحه هر پروژه)، درباره من، تماس
- **پنل ادمین (`/admin`):**
  - ورود امن با ایمیل/رمز (argon2 + سشن دیتابیسی با کوکی httpOnly)
  - مدیریت نمونه‌کارها: افزودن/ویرایش/حذف، آپلود کاور، انتشار/پیش‌نویس، منتخبِ صفحه اصلی
  - پیام‌های فرم تماس: خوانده‌شده/نخوانده، حذف
- **فرم تماس** با اعتبارسنجی zod و ذخیره در دیتابیس
- تاریخ شمسی، RTL کامل، فونت وزیرمتن، سئو و OpenGraph

## اجرای محلی (بدون نیاز به PostgreSQL)

بدون `DATABASE_URL`، اپ از **PGlite** (دیتابیس تعبیه‌شده در `.pglite/`) استفاده می‌کند:

```bash
npm install
npm run db:push     # ساخت جداول
npm run db:seed     # اکانت ادمین + ۳ پروژه نمونه
npm run dev         # http://localhost:3600
```

### ورود به پنل

- آدرس: `/login`
- ایمیل/رمز از `.env` (پیش‌فرض seed: `admin@rimaweb.ir` / `rimaweb-admin` — **حتماً تغییر دهید**)

## دیپلوی با PostgreSQL (Docker)

```bash
docker compose up -d --build
# داخل کانتینر وب (یک بار):
docker compose exec web npx drizzle-kit push
docker compose exec web sh -c "ADMIN_PASSWORD=<رمز-امن> npm run db:seed"
```

با ست‌شدن `DATABASE_URL`، اپ خودکار به PostgreSQL وصل می‌شود.

## برندینگ

- **لوگو، پالت و طراحی UI:** سه نسخه پیش‌نمایش در `design-previews/` (سرو با `node design-previews/server.mjs` روی پورت 3917)
- انتخاب‌های فعلی: لوگوی طرح A + پالت «کهکشان» (تیره) + UI «فوتوریست»
- پالت به‌صورت CSS variables در `src/app/globals.css` (`@theme`) — تعویض پالت فقط همان فایل
- لوگو: `src/components/logo.tsx` و `src/app/icon.svg`

## ساختار

```
src/
  app/            صفحات (خانه، works، about، contact، login، admin، api/contact)
  components/     هدر، فوتر، لوگو، کارت پروژه، فرم تماس
  modules/        auth (سشن + اکشن‌ها)، projects و messages (server actions)
  db/             schema.ts (drizzle) + index.ts (PGlite/Postgres خودکار)
scripts/seed.ts   اکانت ادمین + داده نمونه
```
