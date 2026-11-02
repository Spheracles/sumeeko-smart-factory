# 測試與驗收報告

測試日期：2026-11-03
測試環境：Linux 雲端容器、Chromium（Playwright）、手機視窗 412×915、DPR 2、觸控模擬、SwiftShader WebGL。
**限制：此環境沒有 Android SDK，無法建置 APK，也沒有實體手機或 Android 模擬器。** 所有標為 Pass 的項目都是在瀏覽器中針對 App 的網頁層實際執行；凡需 Android 裝置的項目一律標為 Not Tested。

自動化測試腳本：`web/test/app.py`（25 項斷言）、`web/test/survival.py`、`web/test/sim.test.ts`、`web/test/career.test.ts`，以及原作內建的「模擬引擎自我測試」（10 項）。

## 功能驗收

| 項目 | 結果 | 依據 |
|---|---|---|
| App 可開啟（網頁層） | Pass | 啟動畫面 → 新手引導 → 首頁 |
| App 可開啟（Android APK） | Not Tested | 未建置 APK |
| 主要畫面正常 | Pass | 首頁、場景、圖鑑、機台、工件、工具、教學、任務、我的皆有截圖確認 |
| 原始核心功能正常（職涯模式） | Pass | 進入／離開職涯模式；第十二章生存戰結果回傳、晉升、第十三章解鎖；舊存檔遷移 |
| 選單可以操作 | Pass | 底部五大導航、圖鑑分頁 |
| 人物與設備互動正常 | Pass | 場景點擊機台開啟 Bottom Sheet → 進入機台模擬；人物頁四視角、五動作 |
| 工件資訊能正確顯示 | Pass | 工件頁資料、工序對照滑桿 |
| 3D 工件可渲染 | Pass | 畫布像素檢查；螺栓、螺帽、套管螺絲、盤元、胚體的外觀與剖面截圖確認（`docs/screenshots/parts3d_grid.webp`） |
| 動畫與模擬狀態一致 | Pass | 運轉時動畫啟動；暫停時進度凍結且動畫停止；急停時動畫停止、啟動鈕停用 |
| 急停正確進入停止狀態 | Pass | 未勾選「已確認危險排除」時無法復歸；復歸後回到待機 |
| 故障 → 保養（LOTO）→ 待機 | Pass | 三步驟上鎖掛牌後才能排除完成 |
| 任務可完成 | Pass | T1 全流程成功；紀錄存入本機；「下一個工序」進入 T2 |
| 教學單元完成並保存 | Pass | U01 問答後完成狀態寫入 localStorage |
| 工具互動示範 | Pass | 螺紋環規 GO／NO-GO 判定 |
| 返回鍵正常（網頁層 `__handleBack`） | Pass | 關閉 Sheet → 逐層返回 → 回首頁 → 首頁回傳 false（交由原生結束）；連續快速返回也正確；職涯模式內先回上一畫面再回 App |
| 返回鍵正常（Android 實機） | Not Tested | 需實機驗證 `onBackPressed` 與手勢返回 |
| 設定可以保存 | Pass | 低畫質設定重新載入後仍保留 |
| 任務 T2～T5 全流程 | Not Tested | 共用同一任務引擎，僅 T1 有自動化測試 |
| 生存戰在 App 殼內的 iframe | Not Tested | 已在網頁版測試；App 殼內使用相同元件與相對路徑 |
| 模擬引擎計算（瓶頸、OEE＝A×P×Q、RTY、Little's Law、可重現種子、鳳凰計畫可行解） | Pass | 原作自我測試 10／10 |
| JavaScript 執行期錯誤 | Pass | 所有測試流程中主控台 0 個錯誤 |

## 視覺驗收

| 項目 | 結果 | 依據 |
|---|---|---|
| 圖片沒有嚴重變形 | Pass | 412×915 直式、915×412 橫式截圖檢視 |
| 字體清晰 | Pass（瀏覽器） | 實機字型為 Android 系統 Noto Sans CJK，Not Tested |
| 繁體中文正確 | Pass | 人工檢視；專有名詞採「繁體中文（English）」 |
| 主視覺符合規格 | 部分 Pass | 色彩、九宮格、2.5D 場景、人物、機台皆已完成；人物與機台尚未達到擬真 ACG／UE5 等級（見 TODO） |
| 不同手機比例下不裁切重要資訊 | 部分 Pass | 直式與橫式已檢查；平板與摺疊機 Not Tested。場景在直式時以填滿方式裁切左右兩側，可拖曳查看 |
| 人物與設備比例合理 | Pass | 場景中人物約等於機台高度一半 |
| 互動熱點位置正確 | Pass | 機台部件編號熱點、場景點擊目標 |

## Android 驗收

| 項目 | 結果 | 說明 |
|---|---|---|
| APK 可以安裝 | Not Tested | 未建置 APK |
| 沒有嚴重閃退 | Not Tested | |
| 可於離線模式開啟核心內容 | Pass（網頁層） | 打包後 HTML 不含任何外部資源；網頁層在離線狀態下完整運作。APK Not Tested |
| 觸控正常 | Pass（模擬） | Playwright 觸控模擬；實機 Not Tested |
| 旋轉與安全顯示區域 | Not Tested | 已實作 API 35 edge-to-edge insets 處理與 configChanges |
| APK 簽署狀態明確 | Pass | 文件明確說明：目前無 APK；Debug 由 Android Studio 預設金鑰簽署；Release 需使用者自備金鑰 |
| 下載連結可以正常取得檔案 | Not Tested | 下載頁在設定 APK 網址前，下載按鈕為停用狀態，不提供假連結 |
| Java 程式碼 | 部分 Pass | 以最小 Android API stub 通過 `javac` 語法與型別檢查；**未經真正的 Android Gradle 編譯** |
| Gradle Wrapper | Pass | 將 Wrapper distributionUrl 設為 Gradle 8.9（原始 Wrapper JAR 保留）；Android 外掛解析需網路，Not Tested |

## 效能驗收

| 項目 | 結果 | 說明 |
|---|---|---|
| 實際 FPS | Not Tested | 需實機量測（Android Studio Profiler） |
| 記憶體使用 | Not Tested | |
| 場景載入 | Pass（瀏覽器） | index.html 約 0.6 MB；啟動畫面 0.9 秒 |
| 低效能模式可用 | Pass | 低畫質（DPR 1、低面數模型、關閉光錐與粒子）、低動態、暫停動畫皆可切換並保存 |
| 背景時減少資源使用 | Pass（瀏覽器） | visibilitychange 觸發暫停：3D 停止繪製、音效暫停、CSS 動畫暫停；原生 onPause 呼叫同一函式（Not Tested） |
| 3D 模型面數 | Pass | 標準 588～29,448 三角形；低畫質 428～13,208 |

## 統計

- 自動化斷言：App 網頁層 25／25 Pass；生存戰整合 Pass；模擬自我測試 10／10 Pass。
- 需要 Android 實機或 SDK 的項目：全部 Not Tested。
