import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3600";
const OUT = "design-previews/renders/theme";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const results = [];

// ── Public site, light (default) then dark via toggle ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const isDarkFirst = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  results.push({ firstVisitLight: !isDarkFirst });
  await page.screenshot({ path: `${OUT}/new-1-home-light.png`, fullPage: true });

  // toggle to dark
  await page.locator('button[aria-label="تغییر به تم تیره"]').click();
  await page.waitForTimeout(500);
  const stored = await page.evaluate(() => localStorage.getItem("rimaweb-theme"));
  results.push({ afterToggle: { stored, dark: await page.evaluate(() => document.documentElement.classList.contains("dark")) } });
  await page.screenshot({ path: `${OUT}/new-2-home-dark.png`, fullPage: true });

  // persistence
  await page.reload({ waitUntil: "networkidle" });
  results.push({ persistDark: await page.evaluate(() => document.documentElement.classList.contains("dark")) });

  // inner pages in light (toggle back)
  await page.locator('button[aria-label="تغییر به تم روشن"]').click();
  await page.waitForTimeout(400);
  await page.goto(BASE + "/works", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/new-3-works-light.png`, fullPage: true });
  await page.goto(BASE + "/about", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/new-4-about-light.png`, fullPage: true });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/new-5-contact-light.png`, fullPage: true });
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/new-6-login-light.png` });
  await ctx.close();
}

// ── Admin in both themes ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.locator('input[name="email"]').fill("admin@rimaweb.ir");
  await page.locator('input[name="password"]').fill("rimaweb-admin");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/admin", { timeout: 15000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/new-7-admin-light.png`, fullPage: true });
  await page.locator('button[aria-label="تغییر به تم تیره"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/new-8-admin-dark.png`, fullPage: true });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
