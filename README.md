# SUMEEKO 智慧工廠｜Smart Factory Training Platform

> 以工廠場景為核心的**非官方教育互動 PWA**。從一顆螺絲開始，探索冷鍛、搓牙、熱處理、光學檢驗與智慧物流。

![智慧工廠展示封面](pwa/site/assets/factory-cover.webp)

## 開始體驗

網站發布後：`https://你的GitHub帳號.github.io/sumeeko-smart-factory/`

- **品牌展示站：** `index.html`
- **可安裝 PWA：** `app.html`
- 透過 Chrome 的「安裝應用程式」或支援 PWA 的瀏覽器安裝到手機。

## 功能

- 九宮格互動工廠場景與工作站索引
- 七種設備模擬與運轉／異常／急停／保養狀態
- WebGL 3D 工件與材質切換、半透明、剖視
- T1～T5 製程任務與本機紀錄
- 人物、圖鑑、教學及職涯模式
- PWA 離線快取、安裝資訊、版本更新提示

## 原始碼與專案結構

```
.github/workflows/deploy-pwa-pages.yml  # GitHub Pages 自動發布
web/src/                                # React / TypeScript 主程式
web/build_pwa.ts                        # Bun 正式建置
pwa/site/index.html                     # 第四階段品牌展示站
pwa/site/app.html                       # 真正可操作的 PWA
pwa/site/assets/                        # 新版主視覺素材
pwa/site/icons/                         # 安裝圖示
pwa/site/sw.js                           # 離線快取
android/                                 # 先前 Android 工程，僅手動建置
```

## GitHub Pages 自動建置

將專案根目錄的全部內容推送到 GitHub `main` 分支，於 **Settings → Pages → Build and deployment → Source → GitHub Actions** 啟用。
工作流程會安裝 Bun、型別檢查、重新編譯 React、驗證 PWA 檔案並部署 `pwa/site`。

也可在本機安裝 Bun 後：

```bash
cd web
bun install
bun run typecheck
bun run build:pwa
```

另附 [Windows GitHub Desktop 逐步教學](GITHUB-DESKTOP-STEP-BY-STEP.md)。

## 本次版本與驗證

本版整合第三階段人物、機台、工件與動畫升級，以及第四階段品牌圖片、首頁、圖示、載入視覺與 GitHub Pages 展示站。實際裝置的安裝、離線冷啟動及全任務仍需在正式 HTTPS 部署後驗證。詳細見 `docs/STAGE4-STATUS.md`。

## 聲明

非官方教育模擬；與任何企業的官方產品或品牌背書無關。所有操作、品質數值與設備狀態都是虛擬教學，不可直接用於真實機械。
