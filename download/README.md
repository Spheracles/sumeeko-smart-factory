# APK 下載頁部署說明

1. 依 BUILD-ANDROID.md 建置並簽署 `app-release.apk`。
2. 把 APK 上傳到可公開存取的位置（例如 GitHub Releases、自有網站）。
3. 計算 SHA-256（`sha256sum app-release.apk`）。
4. 編輯 `index.html` 最下方的 `APK` 物件：填入 `url`、`size`、`sha256`、`date`；若是 Debug 版請把 `build` 改為「Debug 測試版」。
5. 把整個 `download/` 資料夾（含 `img/`）部署到任何靜態網站（GitHub Pages、Netlify 等）。

**尚待上傳的檔案**：`sumeeko-smart-factory-1.0.0.apk`（目前不存在）。在填入真實 `.apk` 網址前，下載按鈕維持停用，不會出現假連結。
