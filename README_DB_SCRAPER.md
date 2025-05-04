# 數據庫整合大學爬蟲工具

這是一個專門為留學網站開發的大學數據爬蟲工具，能夠從多個權威來源獲取大學資訊，並直接存儲到網站的數據庫中。

## 功能特點

- 支持多個權威數據源爬取
  - QS World University Rankings
  - U.S. News & World Report
  - Times Higher Education Rankings
  - College Board
  - UCAS (英國)
- 資料自動整合與去重
- 直接存入Prisma數據庫
- JSON備份功能
- 防反爬蟲技術

## 安裝依賴

在使用爬蟲之前，請確保安裝所需的依賴庫：

```bash
npm install axios cheerio puppeteer @prisma/client
```

## 使用方法

### 清理舊數據

若要清除數據庫中的所有學校數據，可以執行：

```bash
node scripts/clearSchools.js
```

### 執行完整爬蟲

若要從所有支援的源獲取數據並存入數據庫，請執行：

```bash
node scripts/scrapeUniversities.js
```

爬取完成後，數據將同時保存在：
- 數據庫的`School`表中
- 備份文件`data/universities.json`

### 自動更新數據

若要定期自動更新數據，可以設置定時任務（Linux/Mac上使用cron，Windows上使用Task Scheduler）：

```
# 例如：每月1日凌晨3點執行爬蟲
0 3 1 * * cd /path/to/project && node scripts/scrapeUniversities.js >> logs/scrape.log 2>&1
```

## 數據庫整合

本爬蟲直接與網站的Prisma數據庫集成，爬取的數據將存儲在`School`表中，包含以下欄位：

- `name`: 學校名稱
- `description`: 學校描述
- `location`: 位置
- `country`: 國家
- `city`: 城市
- `website`: 網站
- `imageUrl`: 圖片URL
- `rating`: 評分
- `tuition`: 學費
- `majors`: 專業
- `facilities`: 設施

## 數據來源

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

## 代碼結構

```
scripts/
  ├─ scrapeUniversities.js  # 執行爬蟲的主腳本
  └─ clearSchools.js        # 清理舊數據腳本
src/
  └─ lib/
      └─ scrapers/
          └─ universityScrapers.js  # 爬蟲核心代碼
prisma/
  └─ schema.prisma          # 數據庫模型定義
```

## 注意事項

1. **使用頻率限制**：爬蟲中已設置隨機延遲，請勿過於頻繁地執行爬蟲，以免被網站封鎖。

2. **數據更新**：各排名數據通常每年更新，建議每年更新一次完整數據。

3. **合法使用**：請務必遵守網站的使用條款和機器人協議(robots.txt)。

4. **錯誤處理**：若爬蟲過程中遇到錯誤，可能是目標網站結構有所變化，請檢查並更新相應的選擇器。

## 許可證

MIT 