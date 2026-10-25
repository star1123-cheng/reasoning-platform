# 推理工坊 Reasoning Platform

輸入答案、自動產生謎題的純前端網站（Vite 5 + React 18 + TypeScript，Vitest 測試）。規格以 `reasoning-platform-spec.md`（v1.2）為準；`reasoning-platform.html` 是單檔原型，密碼演算法以原型為準。

## 位置與備份
- 專案只放在本機 `C:\Users\user\Projects\Reasoning-Platform`，不要放回 Google 雲端硬碟：G: 槽是虛擬磁碟，`npm install` 會失敗（EPERM／EBADF），也不支援 junction 與 symlink。
- 備份用 GitHub 私人儲存庫 `star1123-cheng/reasoning-platform`（分支 `main`）。提交前先執行 `git status` 給使用者確認。

## 指令
- `npm run dev`（預覽設定在 `.claude/launch.json`，名稱 `dev`，port 5173）
- `npm test`、`npm run build`

## 結構
- `src/ciphers/`：27 種密碼，一種一個檔案＋同名 `.test.ts`；`index.ts` 的 `CIPHERS` 陣列順序＝選單順序＝證物編號。
- `src/challenges/`：精選挑戰 16 案（只選公共領域作品，原創白話改寫；`x` 為排除詞）。
- `src/escape/`：密室逃脫。`puzzles/` 是 12 種謎題產生器（純函式），`room.ts` 負責閉環、碎片、匯入檢查與範例房間。
- 提示與線索卡都是結構化資料，由 React 元件渲染；不要用 `dangerouslySetInnerHTML`。

## 慣例
- 四方密碼等 5×5 方陣採 I/J 同格（Tap Code 為 C/K 同格）。
- 跳舞小人圖形由程式產生，不使用 dCode 等外部網站的圖片、字型或程式碼。
- 證書只填「班級代號＋座號」，不收集姓名。

## 待辦
- 實際開啟列印預覽，確認四份密室文件換頁與「附答案」行為。
- 決定部署方式（GitHub Pages 需公開儲存庫；Netlify 可維持私人）。
- 雲端硬碟舊資料夾由使用者自行刪除或改名。
