import { chromium } from "playwright-core";

const target = "http://127.0.0.1:4173/taiwan-tcm-members-assembly-2026/";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
page.on("pageerror", (error) => pageErrors.push(error.message));

const response = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 20_000 });
await page.locator('img[loading="lazy"]').evaluateAll((images) => {
  images.forEach((image) => { image.loading = "eager"; });
});
await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 10_000 });

const audit = await page.evaluate(() => ({
  title: document.title,
  heading: document.querySelector("h1")?.textContent?.trim(),
  baseAssets: [...document.scripts].every((script) => !script.src || script.src.includes("/taiwan-tcm-members-assembly-2026/")),
  horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  images: [...document.images].map((image) => ({ src: image.currentSrc, width: image.naturalWidth })),
  pdfs: [...new Set([...document.querySelectorAll('a[href$=".pdf"]')].map((link) => link.href))],
}));

const pdfs = [];
for (const url of audit.pdfs) {
  const pdf = await context.request.get(url);
  pdfs.push({ url, status: pdf.status(), type: pdf.headers()["content-type"] });
}
const notFound = await context.request.get("http://127.0.0.1:4173/taiwan-tcm-members-assembly-2026/404.html");
const ogCard = await context.request.get("http://127.0.0.1:4173/taiwan-tcm-members-assembly-2026/og.png");
await page.screenshot({
  path: "C:/Users/User/Documents/Codex/2026-08-14/files-mentioned-by-the-user-115/work/prod-preview.png",
  fullPage: true,
});

const result = {
  status: response?.status(),
  consoleErrors,
  pageErrors,
  audit,
  pdfs,
  notFound: notFound.status(),
  ogCard: { status: ogCard.status(), type: ogCard.headers()["content-type"] },
};
console.log(JSON.stringify(result, null, 2));

if (
  result.status !== 200 ||
  consoleErrors.length ||
  pageErrors.length ||
  audit.horizontalOverflow > 1 ||
  audit.images.some((image) => image.width === 0) ||
  pdfs.some((pdf) => pdf.status !== 200 || !pdf.type?.includes("pdf")) ||
  result.notFound !== 200 ||
  result.ogCard.status !== 200 ||
  !result.ogCard.type?.includes("png")
) {
  process.exitCode = 1;
}

await browser.close();
