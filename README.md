# 推理工坊 Reasoning Platform

輸入答案，自動產生可以直接出題的謎題。包含三個分頁：

- **密碼**：27 種密碼（★ 入門到 ★★★★★ 專家），產生謎題、解碼提示與出題者備註，可列印學習單。
- **精選挑戰**：7 個改寫自經典推理小說的案件。
- **密室逃脫**：把 12 種謎題串成閉環關卡，產生關主總表、線索卡、答案紙、提示表，也能線上試玩。

設計規格見 [reasoning-platform-spec.md](reasoning-platform-spec.md)；`reasoning-platform.html` 是單檔原型（演算法以它為準）。

## 技術

Vite 5 + React 18 + TypeScript，純前端、無後端、沒有任何金鑰或環境變數。測試用 Vitest。

## 常用指令

```bash
npm install        # 安裝套件
npm run dev        # 開發模式（http://localhost:5173）
npm test           # 執行單元測試
npm run build      # 建置正式版到 dist/
```

## 注意：不要在 Google 雲端硬碟資料夾裡安裝套件

`npm install` 會在 `node_modules/` 寫入幾千個小檔案，Google 雲端硬碟的同步會鎖住檔案而導致安裝失敗（`EPERM`、`EBADF`）。建議把專案放在本機硬碟（例如 `C:\Users\<你>\Projects\Reasoning-Platform`），備份改用 Git／GitHub。

## 部署

`npm run build` 產出的 `dist/` 是純靜態網頁，可放 GitHub Pages 或 Netlify。設定 `base: './'`，放在子目錄也能正常載入。

## 個資

- 線上試玩的證書只填「班級代號＋座號」（例如 50101），不收集姓名。
- 密室房間只暫存在使用者自己的瀏覽器（localStorage），不會上傳。
