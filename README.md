# 台灣中藥權益促進會 2026 科達製藥參訪活動網站

「中藥材質量管理與源頭管理教育訓練暨科達製藥參訪」互動式活動微型官網。網站以「一株藥材的旅程」為設計主題，整合活動倒數、報名截止提醒、教育訓練、互動行程、交通選擇、費用試算、會員大會資訊與 PDF 文件下載。

## 專案技術

- Vite、React、TypeScript
- Motion for React 動畫
- Lucide React 圖示
- Vitest 單元測試
- ESLint 程式碼檢查
- GitHub Actions 自動部署至 GitHub Pages

## 本地啟動

需要 Node.js 22 LTS 或相容版本。

```bash
npm install
npm run dev
```

開發伺服器會使用 Vite 設定的 GitHub Pages 子路徑；依終端機顯示的 Local URL 開啟即可。

## 檢查與建置

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

正式輸出位於 `dist/`。

## 修改活動資料

可變動內容集中在 `src/data/event.ts`：

- 活動日期、集合時間、結束時間
- 報名截止時間與時區
- 講師、課程與行程
- 費用、地址與 Google Maps 連結
- 聯絡方式
- Logo、插畫與 PDF 路徑

### 修改活動日期或倒數時間

請使用含時區的完整 ISO 8601 格式，例如：

```ts
start: "2026-09-19T08:40:00+08:00"
end: "2026-09-19T20:00:00+08:00"
registrationDeadline: "2026-09-05T23:59:59+08:00"
```

同時更新 `date`、`dateLabel` 與 `index.html` 的 Event JSON-LD 結構化資料。

### 加入正式報名網址

目前正式公文沒有可安全公開的報名網址，因此網站按鈕會連到聯絡區。取得正式網址後，可在 `src/data/event.ts` 新增 `registrationUrl`，並在 `src/App.tsx` 的 Hero 與手機固定行動列改為該網址；外部連結需使用 `target="_blank"` 與 `rel="noreferrer"`。

### 替換圖片與 PDF

- 圖片放在 `public/assets/`，建議使用 WebP，並保留正確寬高比例。
- PDF 放在 `public/docs/`，使用網址安全的英文字檔名。
- 替換檔案後，更新 `src/data/event.ts` 的對應路徑與替代文字。
- 請避免把大型未壓縮原圖放入 `public/`。

## GitHub Pages 部署

`.github/workflows/deploy.yml` 會在推送至 `main` 時依序執行：

1. `npm ci`
2. lint
3. TypeScript typecheck
4. 單元測試
5. production build
6. 上傳 `dist/`
7. 透過 GitHub Pages 官方 Actions 部署

Repository 第一次部署時，請確認：

`Repository → Settings → Pages → Source → GitHub Actions`

## Repository 改名與 Vite base

`vite.config.ts` 在 GitHub Actions 中會從 `GITHUB_REPOSITORY` 自動取得 Repository 名稱：

- 一般專案頁：`/REPOSITORY/`
- `USERNAME.github.io` 使用者網站：`/`

如需在其他環境明確指定，可設定 `BASE_PATH`，例如：

```bash
BASE_PATH=/new-repository/ npm run build
```

## 常見部署問題

- **頁面空白或資源 404**：確認 Repository 名稱與 Vite base 一致，再重新執行 Actions。
- **Pages 尚未啟用**：到 Settings → Pages，將 Source 設為 GitHub Actions。
- **Workflow 沒有部署權限**：確認 Actions 的 permissions 已包含 `pages: write` 與 `id-token: write`。
- **PDF 或圖片無法開啟**：確認檔案存在於 `public/`，路徑由 `import.meta.env.BASE_URL` 組合，不要寫死網域根目錄。
- **Repository 改名後舊快取**：等待新 workflow 完成，並以無痕視窗或強制重新整理正式網址。

## 資料來源

網站活動資訊依「中促會字第 1150801 號」正式通知與附件整理。高鐵參考班次未另行轉錄，請以正式公文原圖及高鐵最新班表為準。
