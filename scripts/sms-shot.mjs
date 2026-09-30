import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3600";
const OUT = "design-previews/renders/theme";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
const page = await ctx.newPage();
const results = [];

// Login
await page.goto(BASE + "/login", { waitUntil: "networkidle" });
await page.locator('input[name="email"]').fill("admin@rimaweb.ir");
await page.locator('input[name="password"]').fill("rimaweb-admin");
await page.locator('button[type="submit"]').click();
await page.waitForURL("**/admin", { timeout: 15000 });

// SMS panel
await page.goto(BASE + "/admin/sms", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
results.push({
  smsPage: {
    hasConnectionForm: await page.getByText("اتصال سامانهٔ پیامکی").count(),
    hasTemplate: await page.getByText("NEW_MESSAGE").count(),
    hasLog: await page.getByText("گزارش ارسال").count(),
    navHasSms: await page.locator('a[href="/admin/sms"]').count(),
  },
});
await page.screenshot({ path: `${OUT}/sms-1-panel.png`, fullPage: true });

// Save settings: notify phone + sandbox on
await page.locator('input[placeholder="مثلاً 09121234567"]').first().fill("09121234567");
await page.locator('input[type="checkbox"]').first().check();
await page.getByRole("button", { name: "ذخیره تنظیمات" }).click();
await page.waitForTimeout(800);
results.push({
  saveFeedback: await page.getByText("تنظیمات پیامک ذخیره شد").count(),
});

// Test send (sandbox → logged, no real SMS)
await page.locator('input[placeholder="09121234567"]').fill("09123456789");
await page.getByRole("button", { name: "ارسال پیامک آزمایشی" }).click();
await page.waitForTimeout(1200);
const testFeedback = await page
  .getByText("حالت تست: پیامک فقط در گزارش ثبت شد")
  .count();
results.push({ testFeedback });

// Contact form → NEW_MESSAGE notify (sandbox → logged)
const contact = await page.evaluate(async () => {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "تست پیامک",
      email: "test@example.com",
      phone: "09120000000",
      body: "این پیام برای تست اتصال سامانه پیامک ریماوب ارسال شده است.",
    }),
  });
  return res.status;
});
results.push({ contactStatus: contact });

// Reload → both rows must appear in the log
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
const sandboxRows = await page.getByText("آزمایشی").count();
const newRow = await page.locator("td", { hasText: "NEW_MESSAGE" }).count();
const testRow = await page.locator("td", { hasText: "TEST" }).count();
results.push({ logAfterReload: { sandboxRows, newRow, testRow } });
await page.screenshot({ path: `${OUT}/sms-2-log.png`, fullPage: true });

// Light theme shot
await page.locator('button[aria-label="تغییر به تم روشن"]').click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/sms-3-light.png`, fullPage: true });

await browser.close();
console.log(JSON.stringify(results, null, 2));
