# SUMEEKO 智慧工廠｜第二階段修正與測試報告

日期：2026-11-03。基底：使用者上傳的 `sumeeko-smart-factory-stage1-fixed(1).zip`，不是從原始未修正版開始。

## 變更內容

1. `web/src/app/Shell.tsx`：九宮格場景縮短 SVG 區域及機台標籤為 `A1..C3` / `M01..M07`，新增可點擊「九宮格工作站索引」，將完整站名改到可捲動的獨立面板，不再在機台上方同時疊加長句。
2. `web/src/app/navigation.ts`：新增可計算的響應式九宮格鏡頭，根據實際畫布長寬比動態設置 SVG viewBox，維持 `meet`，避免 `slice` 剪裁外圍工站；加入任務返回步驟防重複記錄的純函式。
3. `web/src/app/app.css`：直式、短螢幕、橫式的分開佈局；操作條和底部導航不應互相遮蔽；工作站索引在足夠高的直式手機預設開啟，短手機預設收合；更新任務步驟條的窄幅捲動，Bottom Sheet 最大高度。
4. `web/src/app/core.ts`：Escape / BrowserBack 和非輸入狀態的 Backspace 優先呼叫統一返回堆疊，成功處理時防止瀏覽器預設行為。
5. `web/src/app/Shell.tsx` TaskRun：Android 返回鍵／手勢在任務步驟 1～4 回到上一步、回到模擬前清空舊模擬結果；第 5 步已儲存記錄時，返回直接離開任務，防止重複保存。
6. `MainActivity.java`：冷啟動尚未載入 WebView 主頁時忽略返回事件，避免在 JS 尚未就緒前直接結束；保留第一階段 Android 13+ `OnBackInvokedCallback`、Android 8～12 傳統返回路徑。
7. `android/app/build.gradle`：`preBuild` 依賴 `syncWebAssets`，保證 **APK 編譯會先打包 Stage 2 最新原始碼**，不會誤用 ZIP 內的第一階段舊版 HTML。
8. 加入第二階段任務、畫面與返回驗收腳本，並更新 GitHub Actions。

## 本次已實際通過

| 測試項目 | 結果 | 驗證範圍 |
|---|---|---|
| TypeScript `tsc -p web/tsconfig.json` | PASS | Stage 2 已改動的 TypeScript 原始碼；0 個型別錯誤 |
| 第一階段儲存與返回單元測試 | 10 / 10 PASS | Node JS 純邏輯 |
| 第一階段離線資源靜態檢查 | 15 / 15 PASS | 隨 ZIP 內建舊版 HTML 與 Android 設定 |
| 第二階段任務數值、返回步驟、九宮格鏡頭數學、標籤碰撞 | **41 / 41 PASS** | 真正 Stage 2 `appdata.ts` + `navigation.ts` 經 TypeScript 編譯後的 Node 測試 |
| T1 冷鍛成形首件 | PASS | 既有內建 HTML 的 Chromium 六步驟 UI：點檢／修復／加工／量測／判定／儲存 |
| T2 搓牙與螺紋判定 | PASS | 同上 |
| T3 熱處理批次硬度 | PASS | 同上 |
| T4 AOI 篩選驗證 | PASS* | 同上；使用禁用 CSS 動畫的測試設定避免 SwiftShader 瀏覽器卡頓 |
| T5 預置扭力螺帽沖壓 | PASS | 同上 |

上述 T1～T5 都**各自**完成真正的瀏覽器 UI 操作、顯示「任務成功」、`sumeeko-app-v1` 存檔包含通過紀錄，且 `window.__handleBack()` 可返回；並非只跑數學公式。測試時因執行環境安全政策封鎖 `file://` / 網路導覽，採用 `page.set_content()` 加上暫存 `localStorage` shim，這**不是 Android 原生 WebView 的持久化驗證**。

## 限制與待驗證

**本環境沒有 Bun／Android SDK，且不能從套件來源下載。** 無法將改動後的 React 原始碼重新打包成 Stage 2 HTML，也沒有成功 Gradle 編譯，故**沒有 Stage 2 APK**。ZIP 附帶的舊 `index.html` 仍是第一階段版本。已新增 `syncWebAssets`，在具備 Bun 的電腦／GitHub Actions 重新編譯時會自動更新。

因此以下測試一律 **NOT TESTED**，不能宣稱 PASS：

- Stage 2 新版場景的 Chromium 320×568、390×844、412×915、915×412、1024×768 視覺截圖與端到端可點選性（已提供 `stage2_scene_ui.py` 供重建後執行）。
- Stage 2 新版任務返回鍵逐步回退的實際 React UI 行為（純函式 6 項已測，實際 UI 尚待重建驗證）。
- Android 8／13／15 返回實體鍵與 Android 預測返回手勢、旋轉、離線冷啟動、本機資料持久化。
- Debug APK / Gradle 真正編譯、真機 GPU 效能、Android 實際畫面。

建議優先在 GitHub Actions 或開發電腦上執行 workflow，通過新版場景及 T1～T5 再取得 Debug APK；不能以這份報告替代實機驗收。
