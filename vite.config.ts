import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const [repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isUserSite = repositoryName?.endsWith(".github.io");
const defaultBase = isUserSite ? "/" : `/${repositoryName ?? "taiwan-tcm-members-assembly-2026"}/`;
const siteUrl = process.env.SITE_URL ?? (repositoryOwner && repositoryName ? `https://${repositoryOwner}.github.io${defaultBase}` : undefined);

const openGraphPlugin = {
  name: "event-open-graph-metadata",
  transformIndexHtml(html: string) {
    const tags = siteUrl
      ? `<meta property="og:image" content="${siteUrl}og.png" />\n    <meta name="twitter:image" content="${siteUrl}og.png" />`
      : "";
    return html.replace("<!-- OG_IMAGE -->", tags);
  },
};

export default defineConfig({
  base: process.env.BASE_PATH ?? defaultBase,
  plugins: [react(), openGraphPlugin],
  css: {
    postcss: { plugins: [] },
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
});
