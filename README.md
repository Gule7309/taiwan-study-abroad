# 台灣留學資訊平台

台灣留學資訊平台是為台灣學生打造的一站式留學資訊服務網站，提供全面的留學資訊、學校搜尋、VR校園參觀及留學社群支援。

## 主要功能

- **學校搜尋**：提供全球大學的詳細資訊，可依據國家、專業、學費等條件進行篩選
- **VR校園參觀**：透過沉浸式的虛擬實境技術，讓學生能在出發前體驗校園環境
- **留學社群**：連結已在海外的台灣學長姐，分享經驗與獲取第一手的留學建議
- **個性化推薦**：根據學生的學術背景、興趣和預算，推薦最適合的大學和課程
- **用戶管理**：支持電子郵件註冊與 Google 第三方登入，提供完整的個人資料管理功能

## 技術架構

- 前端: Next.js, React, Tailwind CSS
- 視覺效果: Three.js (VR功能)
- 圖標: React Icons
- UI/UX: 響應式設計，支援各種設備
- 認證: JWT, Google OAuth 2.0

## 本地開發

-啟動伺服器:npm run dev
-關閉伺服器:taskkill /F /IM node.exe

### 前提條件

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安裝步驟

1. 克隆專案
```bash
git clone https://github.com/yourusername/taiwan-study-abroad.git
cd taiwan-study-abroad
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 設置環境變數
   - 複製 `.env.example` 文件為 `.env`
   - 根據需要修改環境變數
   - 如需設置 Google 登入功能，請查看 `GOOGLE_OAUTH_SETUP.md` 文件

4. 運行開發伺服器
```bash
npm run dev
# 或
yarn dev
```

5. 打開瀏覽器訪問 http://localhost:3000

## 部署

本項目可以部署到 Vercel、Netlify 或任何支援 Next.js 的平台。

```bash
npm run build
# 或
yarn build
```

## 第三方整合

### Google 登入

本項目支持 Google 第三方登入功能，使用 @react-oauth/google 庫實現。具體設置方法請參考 `GOOGLE_OAUTH_SETUP.md` 文件。

## 貢獻

歡迎提交 Pull Request 或在 Issues 中提出建議。

## 授權

[MIT](LICENSE)
