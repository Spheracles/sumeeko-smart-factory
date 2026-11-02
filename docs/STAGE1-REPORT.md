# 第一階段修復與驗證報告

版本：Stage 1 修正版，2026-11-03

## 修正內容

1. `web/src/shim.d.ts`：補入 `JSX.ElementChildrenAttribute`，消除原先 25 項 `TS2322`。`tsc -p web/tsconfig.json`：**Pass，Exit Code 0**。
2. `MainActivity.java`：Android 13（API 33）以上登錄 `OnBackInvokedCallback`；Android 8–12 由 `onBackPressed()` 共用同一 `handleBackNavigation()`；Activity 銷毀時解除回呼。
3. `AndroidManifest.xml`：明確設定 `android:enableOnBackInvokedCallback="true"`。
4. `android/gradle/wrapper/gradle-wrapper.properties`：調整 Gradle 至 8.9，搭配 AGP 8.7.3 的最低官方相容版本。
5. 新增 `web/test/stage1_logic_test.cjs`：狀態儲存、重啟恢復、返回堆疊與容錯共 10 項驗證。
6. 新增 `web/test/stage1_bundle_audit.py`：離線內建檔案、資源引用、WebView 原生設定與返回鍵入口共 15 項靜態檢查。
7. 新增 `.github/workflows/build-debug-apk.yml`：在具備 Android SDK 且可連線的 GitHub Actions 上嘗試 Debug APK 自動建置，成功後上傳 APK 與 SHA-256。

## 實際執行結果

| 項目 | 結果 | 範圍 |
|---|---|---|
| TypeScript 型別檢查 | **Pass** | 0 型別錯誤 |
| 本機儲存與返回 JS 契約 | **Pass（10/10）** | Node 模擬 LocalStorage、重建 JS 模組、回呼堆疊 |
| 離線資源與 Android 原生配置靜態檢查 | **Pass（15/15）** | HTML 嵌入式 JS/CSS、無外部資源依賴、無 INTERNET 權限 |
| Gradle `assembleDebug` | **Blocked / 未完成** | 執行環境不含 Android SDK、Gradle Distribution，DNS 不能連線外部主機；實際輸出為 `UnknownHostException` |
| Debug APK | **未產出** | 缺乏可執行的 Android 建置環境；本 ZIP 不包含 APK |
| Android 實機冷啟動 | **Not Tested** | 無 Android 手機／模擬器 |
| Android 實體返回與手勢 | **Not Tested** | Java 已修改，尚須編譯及實機確認 |
| Android 離線冷啟動 | **Not Tested** | 靜態資源檢查通過，不等於實機驗證 |
| Android 本機資料重啟持久化 | **Not Tested** | JS 模擬測試通過，不等於 Android WebView 實測 |
| Playwright 新一輪瀏覽器測試 | **Blocked** | 本次容器 Chromium 導覽因管理員限制 `ERR_BLOCKED_BY_ADMINISTRATOR`，未能執行，故不列通過 |

> 已打包的 `index.html`、`survival.html` 仍然是原 ZIP 內提供的網頁資源。這次只修正型別宣告和原生 Java 設定，沒有修改網頁執行邏輯，因此不需要將網頁 JS 重新編譯才能確認這兩項修正。GitHub Actions 會在 Android 建置前重新由原始碼打包。

## 產出真正 APK 的步驟

### 路線 A：Android Studio（Windows）

1. 解壓 ZIP，從 Android Studio 開啟 `sumeeko-smart-factory-android/android`。
2. 讓 SDK Manager 安裝 `Android SDK Platform 35` 和 `Android SDK Build-Tools 35.0.0`，Gradle Sync 需可連外下載。
3. Gradle JDK 選 17（或 21）。
4. 功能表 `Build → Build App Bundle(s) / APK(s) → Build APK(s)`。
5. 成功後檢查 `android/app/build/outputs/apk/debug/app-debug.apk`，這才是可安裝的 Debug APK。
6. 在手機上進行以下測試，並將結果回填：首次冷啟動、頁面多層返回、Android 13+ 手勢返回、無 Wi-Fi/行動網路冷啟動、改設定後強制結束／重新開啟、任務紀錄保存。

### 路線 B：GitHub Actions

1. 將 ZIP 解壓後的**專案內容**（含 `.github/workflows`）放到你自己的 GitHub 儲存庫根目錄（非公開資料請使用私有儲存庫）。
2. 進入 Actions → **Build and test Android Debug APK** → **Run workflow**。
3. 確認工作流程所有建置步驟成功；於該次執行結果的 Artifacts 下載 `sumeeko-smart-factory-debug-apk`。
4. 解壓 Actions Artifact 後會取得 `app-debug.apk` 和 `app-debug.apk.sha256`。若流程失敗，不會有可以假裝成功的 APK。
5. 下載後仍需使用 Android 裝置實際驗收，不可只以 CI 編譯成功當作功能測試完成。

## 後續必要事項

- 首次完成 Android Gradle 編譯後，以實際錯誤訊息修正可能的 Android API 或相依套件問題。
- 在 Android 8、13、15 裝置／模擬器測試返回、旋轉及 WebView 資料持久化。
- 若要正式對外散布，需另行處理商標與發行者識別、Release 簽署、隱私說明。
