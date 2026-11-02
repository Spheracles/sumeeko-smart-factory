# SUMEEKO 第四階段 PWA｜GitHub Pages 部署與驗收

請優先閱讀 [GitHub Desktop 上傳教學](../GITHUB-DESKTOP-START-HERE.md)。

入口：`pwa/site/index.html` 為展示首頁；`pwa/site/app.html` 為可操作 PWA。

GitHub Pages 工作流程：`.github/workflows/deploy-pwa-pages.yml`，在 `main` 分支推送時，使用 Bun 編譯 React/TypeScript、驗證必要網站資源並部署。

PWA manifest 的 `start_url` 設為 `./app.html`、`scope` 設為 `./`，適合專案子路徑的 GitHub Pages；Service Worker 快取主要檔案並支援離線導覽。

此容器的瀏覽器禁止本機 HTTP / file URL 直接導覽，因此正式 HTTPS 安裝、Service Worker 完整流程與 Android 實機仍需部署後驗收。已進行 TypeScript、狀態邏輯、頁面 DOM 及 SW 模擬測試。
