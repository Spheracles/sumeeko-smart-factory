# Windows GitHub Desktop｜SUMEEKO 第四階段上傳教學

1. 將 ZIP 解壓縮到 `C:\Projects\sumeeko-smart-factory`。確認打開資料夾後直接看見 `.github`、`web`、`pwa`、`README.md`，不要上傳 ZIP 本身。
2. 安裝 GitHub Desktop：https://desktop.github.com/，以 GitHub 帳號登入。
3. 開啟 GitHub Desktop → **File → Add local repository...** → **Choose...**，選擇解壓後的 `sumeeko-smart-factory` 資料夾。
4. 若顯示 **This directory does not appear to be a Git repository**，點選 **create a repository here**；名稱 `sumeeko-smart-factory`，Git ignore 不要覆蓋現有 `.gitignore`。完成 Create repository。
5. 於左側 **Changes** 確認存在 `web/`、`pwa/site/`、`.github/workflows/` 等。左下 Summary 輸入 `Stage 4: Brand identity and installable PWA` → **Commit to main**。
6. 點上方 **Publish repository**。名稱建議 `sumeeko-smart-factory`，取消 **Keep this code private**（GitHub Free 的公開 Pages 較易設定）。選擇自己的 GitHub 帳號 → **Publish repository**。
7. 開啟 GitHub 網站內的該儲存庫 → **Settings → Pages → Source: GitHub Actions**。
8. 進入 **Actions**，確認 `Deploy SUMEEKO Stage 4 PWA to GitHub Pages`，必要時點 **Run workflow**，分支選 `main`。
9. 綠色勾勾後進入 **Settings → Pages** 查找網址：`https://<帳號>.github.io/sumeeko-smart-factory/`。
10. 手機 Chrome 開啟網址，點選 **開始體驗**，再透過瀏覽器選單的 **安裝應用程式** 安裝。
11. 安裝後測試九宮格、任務 T1–T5、飛航模式重新開啟、成績保存和版本更新。

**若要修改網站：** 在電腦修改檔案 → GitHub Desktop 左側 **Changes** → Commit to main → **Push origin**。只要推送成功，GitHub Actions 便會重新部署。

**注意：** ZIP 不是 APK。本專案使用 GitHub Pages 託管的 PWA；安裝結果取決於瀏覽器支援及 HTTPS 部署狀態。
