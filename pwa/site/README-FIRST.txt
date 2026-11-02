SUMEEKO 智慧工廠｜第四階段 PWA 發布檔

index.html = 品牌展示首頁（可點擊的正式網站）。
app.html = 可操作、可安裝的 React PWA 智慧工廠。
manifest.webmanifest = 安裝後由 app.html 啟動。
sw.js = 離線資源快取與更新。

建議使用整份工程中的 GitHub Actions 自動建置、部署：
.github/workflows/deploy-pwa-pages.yml

請先使用 HTTPS 網站部署。單獨開啟本機 HTML 不等於完成 PWA 安裝。
更多內容：專案根目錄 README.md 與 GITHUB-DESKTOP-START-HERE.md。
