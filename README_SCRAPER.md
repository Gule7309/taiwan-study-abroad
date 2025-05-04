# 大學數據爬蟲工具

這是一個專門為留學網站開發的大學數據爬蟲工具，能夠從多個權威來源獲取大學資訊，包括排名、學校資訊和詳細資料。

## 功能特點

- 支持多個權威數據源爬取
  - QS World University Rankings
  - U.S. News & World Report
  - Times Higher Education Rankings
  - College Board
  - UCAS (英國)
- 數據自動整合與去重
- 防反爬蟲技術
- 資料自動保存為JSON格式
- 提供REST API介面

## 安裝依賴

在使用爬蟲之前，請確保安裝所需的依賴庫：

```bash
npm install axios cheerio puppeteer
```

## 使用方法

### 執行完整爬蟲

若要從所有支援的源獲取數據，請執行：

```bash
node scripts/scrapeUniversities.js
```

爬取完成後，數據將保存在 `data/universities.json` 中。

### 通過API獲取數據

啟動Next.js服務後，可以通過以下API獲取大學數據：

```
GET /api/universities
```

支援的查詢參數：
- `country`：按國家篩選（如 `country=USA`）
- `name`：按大學名稱搜索（如 `name=Harvard`）
- `limit`：限制返回結果數量，默認100
- `offset`：結果偏移，用於分頁，默認0

### 自定義爬蟲

如果需要針對特定數據源進行爬取，可以在你的代碼中直接使用爬蟲模塊：

```javascript
const { 
  scrapeQSRankings, 
  scrapeUSNews,
  scrapeTHERankings,
  scrapeCollegeBoard,
  scrapeUCAS 
} = require('./src/lib/scrapers/universityScrapers');

// 僅爬取QS排名
const universities = await scrapeQSRankings();
```

## 爬蟲說明

### 數據來源

1. **QS World University Rankings**
   - URL: https://www.topuniversities.com/university-rankings
   - 數據: 全球大學排名、得分、國家

2. **U.S. News & World Report**
   - URL: https://www.usnews.com/best-colleges
   - 數據: 美國大學排名、地理位置

3. **Times Higher Education**
   - URL: https://www.timeshighereducation.com/world-university-rankings
   - 數據: 全球大學排名、評分指標

4. **College Board**
   - URL: https://bigfuture.collegeboard.org
   - 數據: 美國大學信息、入學要求

5. **UCAS**
   - URL: https://www.ucas.com
   - 數據: 英國大學信息、課程設置

### 數據結構

爬取的數據保存為以下結構：

```json
[
  {
    "name": "大學名稱",
    "rank": "排名",
    "country": "國家",
    "city": "城市",
    "state": "州/省",
    "location": "完整地址",
    "score": "評分",
    "sources": ["數據來源1", "數據來源2"],
    "sourceUrls": ["來源URL1", "來源URL2"],
    "detailUrl": "詳情頁面URL"
  }
]
```

## 注意事項

1. **使用頻率限制**：爬蟲中已設置隨機延遲，請勿過於頻繁地執行爬蟲，以免被網站封鎖。

2. **數據更新**：各排名數據通常每年更新，建議每年更新一次完整數據。

3. **合法使用**：請務必遵守網站的使用條款和機器人協議(robots.txt)。

4. **錯誤處理**：若爬蟲過程中遇到錯誤，可能是目標網站結構有所變化，請檢查並更新相應的選擇器。

## 許可證

MIT 