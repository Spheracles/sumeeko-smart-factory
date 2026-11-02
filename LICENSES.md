# 授權清單

## 本專案原創內容

以下內容皆為本專案原創，未使用任何企業品牌圖像、專有照片、商業機密或第三方遊戲素材：

- 所有人物角色、NPC 頭像、機台插圖、工具圖示、場景、App 圖示（SVG／Vector Drawable）
- 工件 3D 幾何（`web/src/app/gl.ts` 於執行時程序化產生）
- 音效（`web/src/app/core.ts` 以 WebAudio 即時合成，無音檔）
- 遊戲劇情、關卡、資料與程式碼

散布條件由專案擁有者決定（建議：教育用途、非商業、標示出處）。

## 第三方軟體

| 名稱 | 用途 | 授權 | 是否隨 App 散布 |
|---|---|---|---|
| React、React DOM 19 | 網頁介面框架 | MIT License，Copyright (c) Meta Platforms, Inc. and affiliates | 是（打包於 index.html） |
| AndroidX WebKit 1.12.1 | WebViewAssetLoader | Apache License 2.0，Copyright The Android Open Source Project | 是（Gradle 相依） |
| Android Gradle Plugin、Gradle Wrapper | 建置工具 | Apache License 2.0 | 否（僅建置用；wrapper jar 隨工程提供） |
| TypeScript | 型別檢查 | Apache License 2.0 | 否（開發用） |
| Bun | 網頁打包 | MIT License | 否（開發用） |
| Playwright | 端到端測試 | Apache License 2.0 | 否（開發用） |

## 字型

App 使用 Android 系統內建中文字型（Noto Sans CJK，SIL Open Font License 1.1，由系統提供），不隨 App 散布任何字型檔。網頁版原作曾載入 Google Fonts，App 版已移除。

## 商標與資料聲明

「世德工業」「SUMEEKO」為其所有者之名稱。本作為非官方教育作品，以公開資訊（企業公開資料、公開專利的專利號與名稱）為題材；人物、制度、數據、事件、客戶與所有模擬參數皆為虛構，不代表任何公司實際營運、財務或製程參數。
