# BUILD-ANDROID：建置、簽署與安裝

## 0. 架構說明：為什麼不是 Capacitor

原作是 React 單頁應用。本工程採用**原生 Android WebView 殼＋AndroidX WebViewAssetLoader**，而不是 Capacitor：

- App 不需要任何原生外掛（相機、檔案、推播都沒有用到），Capacitor 的主要好處用不上。
- 少一層 npm 套件與 `npx cap sync`，**Android Studio 開啟即可建置，不需要 Node.js**（網頁資源已預先打包進 `assets/www`）。
- 原生端只有一個 `MainActivity.java`，唯一的第三方相依是 `androidx.webkit`。

規格中「若採用 Capacitor，驗證 `npm install / npm run build / npx cap sync android`」的流程因此不適用。若日後需要原生外掛，可再改為 Capacitor（web 層不需改動，見第 9 節）。

## 1. 安裝環境

| 項目 | 版本 | 說明 |
|---|---|---|
| Android Studio | Ladybug（2024.2）以上 | 內含 JDK 17／21 |
| Android SDK Platform | API 35 | SDK Manager 安裝 |
| Android SDK Build-Tools | 35.x | 首次 Sync 時自動安裝 |
| Gradle | 8.14.3 | 由 Wrapper 自動下載 |
| Android Gradle Plugin | 8.7.3 | 由 Gradle 自動下載 |
| JDK | 17 以上 | Android Studio 內建即可 |

最低支援 Android 8.0（API 26），目標 API 35，ARM64 與 x86_64 皆可（純 Java＋WebView，無原生 .so）。
裝置需安裝並更新「Android System WebView」（Google Play 自動更新）。

## 2. 用 Android Studio 建置 Debug APK

1. `File → Open…` → 選擇 `android/` 資料夾（不是整個 ZIP 根目錄）。
2. 等待 Gradle Sync 完成（第一次會下載 Gradle 8.9、AGP 8.7.3、androidx.webkit）。
3. 若提示建立 `local.properties`（SDK 路徑），按確定即可。
4. `Build → Build App Bundle(s) / APK(s) → Build APK(s)`。
5. 產出：`android/app/build/outputs/apk/debug/app-debug.apk`（套件名稱 `tw.sumeeko.learning.factory.debug`，**Debug 測試版**）。

### 指令列

macOS／Linux：

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

Windows（命令提示字元或 PowerShell）：

```bat
cd android
gradlew.bat assembleDebug
```

需先設定 `ANDROID_HOME`（或在 `android/local.properties` 寫入 `sdk.dir=C\:\\Users\\你\\AppData\\Local\\Android\\Sdk`）。

## 3. 修改網頁內容後重新打包（選用）

只有修改 `web/src` 時才需要。網頁層使用 [Bun](https://bun.sh) 打包（開發時實際使用的工具）：

```bash
cd web
npm install          # 安裝 react、react-dom、typescript
bun build_app.ts ../android/app/src/main/assets/www
```

`build_app.ts` 會：

- 把 `src/app/main_app.tsx` 打包成單一 `index.html`（JS、CSS 全部內嵌，不載入任何外部字型或 CDN）
- 複製 `../survival/survival.html`（第十二章「AI 工程師生存戰」）並移除外部字型連結

然後回到 Android Studio 重新建置。

型別檢查：`npx tsc -p .`（專案以 `src/shim.d.ts` 提供精簡 React 型別宣告；若安裝 `@types/react`，請刪除 shim）。

## 4. 正式版（Release）簽署

本工程**不含**任何金鑰。請自行建立並妥善保管：

```bash
keytool -genkeypair -v -keystore sumeeko-release.jks -keyalg RSA -keysize 4096 -validity 10000 -alias sumeeko
```

1. 把 `.jks` 放在**工程以外**的安全位置。
2. 複製 `android/keystore.properties.example` 為 `android/keystore.properties`，填入路徑與密碼（此檔已列入 `.gitignore`，**不可**上傳或放入公開 ZIP）。
3. 建置：

```bash
./gradlew assembleRelease        # Windows：gradlew.bat assembleRelease
```

產出 `android/app/build/outputs/apk/release/app-release.apk`。沒有 `keystore.properties` 時，Release 會是**未簽署**的 APK，不能安裝。
上架 Google Play 建議改用 `./gradlew bundleRelease` 產出 AAB，並啟用 Play App Signing。

計算下載頁需要的 SHA-256：

```bash
sha256sum app-release.apk                 # Linux
shasum -a 256 app-release.apk             # macOS
certutil -hashfile app-release.apk SHA256 # Windows
```

## 5. 安裝方式

- **USB／ADB**：`adb install -r app/build/outputs/apk/debug/app-debug.apk`
- **直接安裝**：把 APK 傳到手機，用檔案管理器開啟；首次需允許「安裝不明來源的應用程式」。
- Debug 與 Release 套件名稱不同（`.debug` 後綴），可同時安裝。

## 6. 套件名稱與品牌

預設 `applicationId` 為 `tw.sumeeko.learning.factory`。本作為非官方教育作品；若要公開散布或上架，請把 `app/build.gradle` 的 `applicationId`、`namespace` 與 Java 套件路徑改為你自己的網域，並確認名稱使用不涉及商標問題。

## 7. 除錯

- Debug 版已啟用 WebView 遠端除錯：桌機 Chrome 開啟 `chrome://inspect`，可檢視主控台與 localStorage。
- 網頁層可直接在桌機瀏覽器測試：開啟 `web/dist-app/index.html`（執行 `bun build_app.ts ./dist-app` 產生）。
- 端到端測試：`cd web && python3 test/app.py`（需 Python Playwright）。

## 8. 常見錯誤排查

| 症狀 | 原因與處理 |
|---|---|
| Sync 失敗：`Could not resolve com.android.tools.build:gradle:8.7.3` | 網路無法連到 Google Maven。檢查代理設定（`File → Settings → HTTP Proxy`）。 |
| `SDK location not found` | 建立 `android/local.properties` 並設定 `sdk.dir`，或設定 `ANDROID_HOME`。 |
| `Unsupported class file major version` | Gradle JDK 版本不符：`Settings → Build Tools → Gradle → Gradle JDK` 選 17 或 21。 |
| AGP 要求升級提示 | 可接受 Android Studio 建議的 AGP 小版本升級；本工程沒有使用已棄用 API。 |
| 開啟 App 一片空白 | 更新「Android System WebView」。若仍空白，`MainActivity` 會自動改用 `file:///android_asset/` 備援路徑；仍失敗請用 `chrome://inspect` 查看錯誤。 |
| `gradlew: Permission denied` | `chmod +x gradlew` |
| 返回鍵直接離開 | 正常行為只在首頁發生；其他頁面應回上一層。若異常，確認 `index.html` 為最新打包版本。 |
| 3D 工件顯示「無法啟用 3D」 | 裝置不支援 WebGL（極少數舊機或模擬器未開 GPU）。模擬器請設定 Graphics：Hardware。 |

## 9. 若要改用 Capacitor（選用）

```bash
cd web
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "SUMEEKO 智慧工廠" tw.sumeeko.learning.factory --web-dir dist-app
bun build_app.ts ./dist-app
npx cap add android
npx cap sync android
```

並在 Capacitor 產生的 MainActivity 中處理返回鍵：呼叫 `window.__handleBack()`，回傳 `false` 時才結束 App。此路徑**未在本專案中測試**。

## Stage 2 補充：自動更新行動介面與任務測試（2026-11-03）

**重要：** ZIP 附帶的 `android/app/src/main/assets/www/index.html` 是上一階段已打包的網頁層，**不能視為 Stage 2 新版**。Stage 2 的正式修改位於 `web/src/`，需要使用 Bun 重新打包。為避免 Android Studio 靜默使用舊版資源，`android/app/build.gradle` 的 `preBuild` 已依賴 `syncWebAssets`，在編譯任何 APK 前自動由現行 TypeScript 重新產生離線 HTML。如果電腦沒有安裝 Bun，建置會清楚失敗，不會假裝產生新版 APK。

Windows 使用者先安裝 Bun（參考 https://bun.sh/），開啟終端機：

```powershell
cd web
bun install
bun run typecheck
node test/stage2_logic_test.cjs
bun build_app.ts ../android/app/src/main/assets/www
cd ../android
.\gradlew.bat assembleDebug
```

Linux/macOS：同理改用 `./gradlew assembleDebug`。請確保 Android SDK、JDK 17 與 Gradle 套件可用。

**可在有 Chromium / Playwright 的電腦額外驗收新版：**

```bash
cd web
bun build_app.ts ./dist-app
python3 -m pip install playwright
python3 -m playwright install chromium
python3 test/stage2_scene_ui.py
for task in T1 T2 T3 T4 T5; do python3 test/stage2_e2e.py --task "$task"; done
```

GitHub Actions 的 `.github/workflows/build-debug-apk.yml` 已加入新版編譯、畫面與五項任務的完整瀏覽器驗收；**這個 workflow 尚未在此環境實際執行**。
