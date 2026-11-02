# 從這裡開始｜GitHub Desktop 首次上傳指南

專案資料夾：`sumeeko-smart-factory`。

1. 解壓整份 ZIP 到 `C:\Projects\`，確認 `C:\Projects\sumeeko-smart-factory\README.md` 存在。
2. [安裝 GitHub Desktop](https://desktop.github.com/)，登入 GitHub。
3. GitHub Desktop 選 **File → Add local repository... → Choose...**，選擇 `C:\Projects\sumeeko-smart-factory`。
4. 若跳出不是 Git 儲存庫，選 **create a repository here**；Name=`sumeeko-smart-factory`、Local path 不要改錯。
5. 檢查左側 **Changes** 包含 `.github/workflows/deploy-pwa-pages.yml`、`web/`、`pwa/site/` 與 `README.md`。
6. 左下 **Summary** 填 `Stage 4: SUMEEKO brand and PWA release` → **Commit to main**。
7. 上方點 **Publish repository** → Name=`sumeeko-smart-factory`；公開發布請取消 **Keep this code private** → Publish。
8. GitHub 網頁進入儲存庫 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
9. **Actions** 找到 `Deploy SUMEEKO Stage 4 PWA to GitHub Pages`。若沒有執行，點 **Run workflow**，分支選 main。
10. 完成後開啟 Pages 網址 `https://你的帳號.github.io/sumeeko-smart-factory/`，按「開始體驗」進入 React PWA；用手機 Chrome 安裝。

如有錯誤，請複製 Actions 紅色步驟和訊息，或截圖 GitHub Desktop 畫面，便能針對專案修正。

**不要把 ZIP 當單一檔案上傳，也不要再額外用 GitHub 網頁建立一份已含 README 的空專案，避免產生兩份儲存庫。**
