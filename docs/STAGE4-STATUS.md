# Stage 4 完成狀態

**已完成**
- 整合 Stage 3 React/TypeScript 美術程式（人物、機台、WebGL 金屬材質、CSS 場景氛圍）
- Stage 4 品牌圖像與 PWA 圖示（192/512/maskable）
- 響應式 GitHub Pages 實際展示網站（非僅設計稿）
- 可操作 PWA 的獨立入口 `app.html`、manifest start_url 與離線清單
- GitHub Actions 自動重新建置 React + Pages 部署

**仍需於 GitHub / Android 驗證**
- 第一次 GitHub Actions Bun 正式建置是否成功
- Android 實機 PWA 安裝、離線冷啟動、更新與資料保存
- 新版 T1–T5 瀏覽器/實機流程全數重新驗收

**建置方法**
`cd web && bun install && bun run build:pwa`

若在不具備 Bun 的離線容器中，為了本機預覽可使用根目錄 `node build_pwa_local.cjs`，此為替代版本，真正發布將以 Actions 裡 Bun 的正式編譯輸出為準。

## 本機新增驗證
- 使用已保存的 React 19 runtime 與 TypeScript 模組重新編譯後，Chromium 內嵌 HTML 實測：新手引導 → 首頁 → 工作場景可正常渲染，無 JavaScript 例外。
- `node pwa/test_sw.cjs` 的 6 項 Service Worker 快取模擬檢查通過。
- 本機 Chromium 禁止透過 localhost／file 導覽，因此尚不能聲稱完整的 HTTPS PWA 安裝與離線冷啟動測試完成。
