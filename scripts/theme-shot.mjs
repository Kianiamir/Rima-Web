import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3600";
const OUT = "design-previews/renders/theme";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function newPage(colorScheme) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme,
  });
  const page = await ctx.newPage();
  return { ctx, page };
}

const results = [];

// --- 1) First visit, OS dark -> default dark theme
{
  const { ctx, page } = await newPage("dark");
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const isLight = await page.evaluate(() => document.documentElement.classList.contains("light"));
  results.push({ shot: "home-dark-first-visit", expectedDark: true, gotLight: isLight });
  await page.screenshot({ path: `${OUT}/1-home-dark.png` });

  // --- 2) Click toggle (top-left) -> light
  await page.locator('button[aria-label="تغییر به تم روشن"]').click();
  await page.waitForTimeout(500);
  const stored = await page.evaluate(() => localStorage.getItem("rimaweb-theme"));
  const lightNow = await page.evaluate(() => document.documentElement.classList.contains("light"));
  results.push({ shot: "home-light-after-toggle", stored, lightNow });
  await page.screenshot({ path: `${OUT}/2-home-light.png` });

  // --- 3) Reload -> persistence (must stay light)
  await page.reload({ waitUntil: "networkidle" });
  const lightAfterReload = await page.evaluate(() => document.documentElement.classList.contains("light"));
  results.push({ check: "persist-after-reload", lightAfterReload });
  await page.screenshot({ path: `${OUT}/3-home-light-reload.png` });
  await ctx.close();
}

// --- 4) Admin dashboard in both themes (login once)
{
  const { ctx, page } = await newPage("dark");
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.locator('input[name="email"]').fill("admin@rimaweb.ir");
  await page.locator('input[name="password"]').fill("rimaweb-admin");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/admin", { timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/4-admin-dark.png` });

  await page.locator('button[aria-label="تغییر به تم روشن"]').click();
  await page.waitForTimeout(500);
  const lightAdmin = await page.evaluate(() => document.documentElement.classList.contains("light"));
  results.push({ shot: "admin-light", lightAdmin });
  await page.screenshot({ path: `${OUT}/5-admin-light.png` });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
