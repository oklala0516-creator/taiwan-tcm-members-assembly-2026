import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const target = "http://127.0.0.1:5173/taiwan-tcm-members-assembly-2026/";
const outputDir = "C:/Users/User/Documents/Codex/2026-08-14/files-mentioned-by-the-user-115/work/qa-screenshots";
const reportPath = "C:/Users/User/Documents/Codex/2026-08-14/files-mentioned-by-the-user-115/work/qa-report.json";
const executablePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const report = { viewports: [], interactions: {}, timedStates: {}, reducedMotion: {}, failures: [] };

const captureViewport = async (name, width, height) => {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText}`));

  const response = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await page.waitForSelector("h1");
  await page.waitForTimeout(1200);
  await page.locator('img[loading="lazy"]').evaluateAll((images) => {
    images.forEach((image) => { image.loading = "eager"; });
  });
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 10_000 });

  const pageAudit = await page.evaluate(() => {
    const images = [...document.images].map((image) => ({
      src: image.currentSrc,
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      renderedWidth: image.getBoundingClientRect().width,
    }));
    const countdown = document.querySelector(".countdown-grid")?.getBoundingClientRect();
    const actionBar = document.querySelector(".mobile-action-bar")?.getBoundingClientRect();
    const footer = document.querySelector(".site-footer")?.getBoundingClientRect();
    return {
      title: document.title,
      lang: document.documentElement.lang,
      statusText: document.querySelector(".registration-strip")?.textContent?.trim(),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      images,
      countdownWithinViewport: !countdown || (countdown.left >= -1 && countdown.right <= window.innerWidth + 1),
      actionBarVisible: !!actionBar && getComputedStyle(document.querySelector(".mobile-action-bar")).display !== "none",
      actionBarHeight: actionBar?.height ?? 0,
      footerBottomPadding: footer ? Number.parseFloat(getComputedStyle(document.querySelector(".site-footer")).paddingBottom) : 0,
      primaryHeading: document.querySelector("h1")?.textContent?.trim(),
      documentLinks: [...document.querySelectorAll('a[href$=".pdf"]')].map((link) => link.href),
      hashLinks: [...document.querySelectorAll('a[href^="#"]')].map((link) => link.getAttribute("href")),
    };
  });

  const uniqueDocuments = [...new Set(pageAudit.documentLinks)];
  const pdfChecks = [];
  for (const url of uniqueDocuments) {
    const pdfResponse = await context.request.get(url);
    pdfChecks.push({ url, status: pdfResponse.status(), contentType: pdfResponse.headers()["content-type"] });
  }

  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: true });
  const result = {
    name,
    width,
    height,
    httpStatus: response?.status() ?? null,
    consoleErrors,
    pageErrors,
    failedRequests,
    pdfChecks,
    ...pageAudit,
  };
  report.viewports.push(result);

  if (name === "390x844") {
    await page.keyboard.press("Home");
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
    await page.getByRole("button", { name: /選單|關閉/ }).click();
    const menuExpanded = await page.getByRole("button", { name: /選單|關閉/ }).getAttribute("aria-expanded");
    const menuLinkCount = await page.locator("#mobile-menu a").count();
    await page.getByRole("link", { name: "交通方式" }).last().click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "自行前往" }).click();
    await page.getByText("09:30 前於科達製藥報到").waitFor();
    const transportText = await page.locator(".transport-result").innerText();
    await page.locator('.location-card button').first().click();
    const copyToast = await page.locator(".toast").innerText();
    await page.getByLabel("非會員").check();
    await page.getByLabel(/晚宴餐敘/).uncheck();
    const feeText = await page.locator(".fee-result strong").innerText();
    report.interactions = { firstFocused, menuExpanded, menuLinkCount, transportText, copyToast, feeText };
  }

  await context.close();
};

await captureViewport("390x844", 390, 844);
await captureViewport("430x932", 430, 932);
await captureViewport("768x1024", 768, 1024);
await captureViewport("1440x900", 1440, 900);

const timedCases = [
  ["open", "2026-08-14T12:00:00+08:00", "報名截止倒數"],
  ["urgent", "2026-09-03T10:00:00+08:00", "報名即將截止"],
  ["closed", "2026-09-10T10:00:00+08:00", "線上報名期限已截止"],
  ["during", "2026-09-19T10:30:00+08:00", "活動進行中"],
  ["after", "2026-09-20T10:00:00+08:00", "本次活動已圓滿結束"],
];

for (const [name, now, expected] of timedCases) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(({ iso }) => {
    const RealDate = Date;
    const fixed = new RealDate(iso).getTime();
    class MockDate extends RealDate {
      constructor(...args) { super(...(args.length ? args : [fixed])); }
      static now() { return fixed; }
    }
    window.Date = MockDate;
  }, { iso: now });
  const page = await context.newPage();
  await page.goto(target, { waitUntil: "domcontentloaded", timeout: 20_000 });
  const text = await page.locator(".countdown-wrap").innerText();
  const currentLabels = await page.locator(".live-label").allInnerTexts();
  report.timedStates[name] = { now, expected, matched: text.includes(expected), text, currentLabels, hasNegative: /-\d/.test(text) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(target, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await page.waitForTimeout(300);
  report.reducedMotion = await page.evaluate(() => ({
    prefersReducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    floatingLeafAnimations: document.querySelector(".floating-leaf")?.getAnimations().length ?? 0,
    timelineAnimationDuration: getComputedStyle(document.querySelector(".timeline")).animationDuration,
    visibleContent: Boolean(document.querySelector("h1")?.getBoundingClientRect().height),
  }));
  await context.close();
}

for (const viewport of report.viewports) {
  if (viewport.httpStatus !== 200) report.failures.push(`${viewport.name}: HTTP ${viewport.httpStatus}`);
  if (viewport.horizontalOverflow > 1) report.failures.push(`${viewport.name}: horizontal overflow ${viewport.horizontalOverflow}px`);
  if (!viewport.countdownWithinViewport) report.failures.push(`${viewport.name}: countdown outside viewport`);
  if (viewport.consoleErrors.length) report.failures.push(`${viewport.name}: console errors`);
  if (viewport.pageErrors.length) report.failures.push(`${viewport.name}: page errors`);
  if (viewport.failedRequests.length) report.failures.push(`${viewport.name}: failed requests`);
  if (viewport.images.some((image) => !image.complete || image.naturalWidth === 0)) report.failures.push(`${viewport.name}: broken image`);
  if (viewport.pdfChecks.some((pdf) => pdf.status !== 200 || !pdf.contentType?.includes("pdf"))) report.failures.push(`${viewport.name}: broken PDF`);
}
for (const [name, state] of Object.entries(report.timedStates)) {
  if (!state.matched || state.hasNegative) report.failures.push(`timed state ${name}`);
}
if (!report.reducedMotion.prefersReducedMotion || !report.reducedMotion.visibleContent) report.failures.push("reduced motion");

await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
await browser.close();

console.log(JSON.stringify({
  failures: report.failures,
  viewports: report.viewports.map(({ name, horizontalOverflow, consoleErrors, pageErrors, failedRequests }) => ({ name, horizontalOverflow, consoleErrors, pageErrors, failedRequests })),
  interactions: report.interactions,
  timedStates: Object.fromEntries(Object.entries(report.timedStates).map(([name, state]) => [name, { matched: state.matched, hasNegative: state.hasNegative, currentLabels: state.currentLabels }])),
  reducedMotion: report.reducedMotion,
}, null, 2));
