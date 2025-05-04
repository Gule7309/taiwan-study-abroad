// 大學數據爬蟲管理模塊
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');

// 初始化Prisma客户端
const prisma = new PrismaClient();

// 用於存儲從所有來源爬取的大學數據
let allUniversities = [];

// 基本配置，避免被識別為爬蟲
const config = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  },
  timeout: 30000, // 30秒
};

// 隨機延遲函數，避免頻繁請求
const randomDelay = async (min = 2000, max = 5000) => {
  const delay = Math.floor(Math.random() * (max - min)) + min;
  console.log(`等待 ${delay / 1000} 秒...`);
  return new Promise(resolve => setTimeout(resolve, delay));
};

// QS大學排名爬蟲
const scrapeQSRankings = async () => {
  console.log('正在爬取 QS World University Rankings 數據...');
  const universities = [];
  
  try {
    // 使用Puppeteer處理動態加載的內容
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // 設置用戶代理
    await page.setUserAgent(config.headers['User-Agent']);
    
    // 訪問QS大學排名頁面
    await page.goto('https://www.topuniversities.com/university-rankings/world-university-rankings/2024', {
      waitUntil: 'networkidle2',
    });
    
    // 等待排名表格加載完成
    await page.waitForSelector('.uni-link');
    
    // 獲取頁面內容
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // 解析大學數據
    $('.ranking-institution-row').each((index, element) => {
      const rank = $(element).find('.rank').text().trim();
      const name = $(element).find('.uni-link').text().trim();
      const country = $(element).find('.location').text().trim();
      const scoreElement = $(element).find('.overall .value');
      const score = scoreElement.length ? scoreElement.text().trim() : 'N/A';
      
      if (name) {
        universities.push({
          name,
          rank: rank || 'N/A',
          country,
          score,
          source: 'QS World University Rankings',
          sourceUrl: 'https://www.topuniversities.com/university-rankings',
        });
      }
    });
    
    await browser.close();
    console.log(`從 QS Rankings 成功抓取 ${universities.length} 所大學數據`);
  } catch (error) {
    console.error('爬取 QS Rankings 失敗:', error);
  }
  
  return universities;
};

// US News排名爬蟲
const scrapeUSNews = async () => {
  console.log('正在爬取 U.S. News & World Report 數據...');
  const universities = [];
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setUserAgent(config.headers['User-Agent']);
    await page.goto('https://www.usnews.com/best-colleges/rankings/national-universities', {
      waitUntil: 'networkidle2',
    });
    
    // 等待排名列表加載完成
    await page.waitForSelector('.sep-section');
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // 解析大學數據
    $('.sep-section').each((index, element) => {
      const rankEl = $(element).find('.rank-holder.highlighted.tooltip-link');
      const rank = rankEl.length ? rankEl.text().trim().replace(/\D/g, '') : 'N/A';
      
      const name = $(element).find('.h3.heading a').text().trim();
      const locationEl = $(element).find('.location');
      const location = locationEl.length ? locationEl.text().trim() : '';
      
      // 提取城市和州
      let city = '';
      let state = '';
      if (location) {
        const locationParts = location.split(',');
        city = locationParts[0] ? locationParts[0].trim() : '';
        state = locationParts[1] ? locationParts[1].trim() : '';
      }
      
      // 獲取詳情頁面鏈接
      const detailUrl = $(element).find('.h3.heading a').attr('href') || '';
      
      if (name) {
        universities.push({
          name,
          rank,
          country: 'USA',
          city,
          state,
          detailUrl: detailUrl ? `https://www.usnews.com${detailUrl}` : '',
          source: 'U.S. News & World Report',
          sourceUrl: 'https://www.usnews.com/best-colleges',
        });
      }
    });
    
    await browser.close();
    console.log(`從 U.S. News 成功抓取 ${universities.length} 所大學數據`);
  } catch (error) {
    console.error('爬取 U.S. News 失敗:', error);
  }
  
  return universities;
};

// THE (Times Higher Education) 排名爬蟲
const scrapeTHERankings = async () => {
  console.log('正在爬取 Times Higher Education Rankings 數據...');
  const universities = [];
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setUserAgent(config.headers['User-Agent']);
    await page.goto('https://www.timeshighereducation.com/world-university-rankings/2024/world-ranking', {
      waitUntil: 'networkidle2',
    });
    
    // 等待排名表格加載完成
    await page.waitForSelector('.ranking-institution-title');
    
    // 獲取頁面內容
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // 解析大學數據
    $('.jsx-1869062274').each((index, element) => {
      const rank = $(element).find('.rank').text().trim();
      const name = $(element).find('.ranking-institution-title').text().trim();
      const country = $(element).find('.country').text().trim();
      
      // 獲取詳情頁面鏈接
      const detailUrl = $(element).find('.ranking-institution-title').attr('href') || '';
      
      if (name) {
        universities.push({
          name,
          rank: rank || 'N/A',
          country,
          detailUrl: detailUrl ? `https://www.timeshighereducation.com${detailUrl}` : '',
          source: 'Times Higher Education',
          sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings',
        });
      }
    });
    
    await browser.close();
    console.log(`從 THE Rankings 成功抓取 ${universities.length} 所大學數據`);
  } catch (error) {
    console.error('爬取 THE Rankings 失敗:', error);
  }
  
  return universities;
};

// The College Board 爬蟲
const scrapeCollegeBoard = async () => {
  console.log('正在爬取 College Board 數據...');
  const universities = [];
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setUserAgent(config.headers['User-Agent']);
    await page.goto('https://bigfuture.collegeboard.org/college-search', {
      waitUntil: 'networkidle2',
    });
    
    // 搜索所有學校
    await page.waitForSelector('.college-search-box input');
    await page.click('.college-search-box input');
    await page.keyboard.type(' ');
    await page.keyboard.press('Enter');
    
    // 等待搜索結果加載
    await page.waitForSelector('.college-item');
    
    // 獲取頁面內容
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // 解析大學數據
    $('.college-item').each((index, element) => {
      const name = $(element).find('.college-name').text().trim();
      const locationEl = $(element).find('.college-location');
      const location = locationEl.length ? locationEl.text().trim() : '';
      
      // 提取城市和州
      let city = '';
      let state = '';
      if (location) {
        const locationParts = location.split(',');
        city = locationParts[0] ? locationParts[0].trim() : '';
        state = locationParts[1] ? locationParts[1].trim() : '';
      }
      
      // 獲取詳情頁面鏈接
      const detailUrl = $(element).find('a').attr('href') || '';
      
      if (name) {
        universities.push({
          name,
          country: 'USA',
          city,
          state,
          detailUrl: detailUrl ? `https://bigfuture.collegeboard.org${detailUrl}` : '',
          source: 'College Board',
          sourceUrl: 'https://bigfuture.collegeboard.org',
        });
      }
    });
    
    await browser.close();
    console.log(`從 College Board 成功抓取 ${universities.length} 所大學數據`);
  } catch (error) {
    console.error('爬取 College Board 失敗:', error);
  }
  
  return universities;
};

// UCAS (英國) 大學爬蟲
const scrapeUCAS = async () => {
  console.log('正在爬取 UCAS 數據...');
  const universities = [];
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setUserAgent(config.headers['User-Agent']);
    await page.goto('https://www.ucas.com/explore/search/providers', {
      waitUntil: 'networkidle2',
    });
    
    // 等待大學列表加載完成
    await page.waitForSelector('.provider-card');
    
    // 獲取頁面內容
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // 解析大學數據
    $('.provider-card').each((index, element) => {
      const name = $(element).find('.provider-card-title').text().trim();
      const location = $(element).find('.provider-card-location').text().trim();
      
      // 獲取詳情頁面鏈接
      const detailUrl = $(element).find('a').attr('href') || '';
      
      if (name) {
        universities.push({
          name,
          country: 'United Kingdom',
          location,
          detailUrl: detailUrl ? `https://www.ucas.com${detailUrl}` : '',
          source: 'UCAS',
          sourceUrl: 'https://www.ucas.com',
        });
      }
    });
    
    await browser.close();
    console.log(`從 UCAS 成功抓取 ${universities.length} 所大學數據`);
  } catch (error) {
    console.error('爬取 UCAS 失敗:', error);
  }
  
  return universities;
};

// 主爬蟲函數
const scrapeAllUniversities = async () => {
  console.log('開始爬取各大學數據源...');
  
  try {
    // 爬取各個數據源
    const qsUniversities = await scrapeQSRankings();
    await randomDelay();
    
    const usNewsUniversities = await scrapeUSNews();
    await randomDelay();
    
    const theUniversities = await scrapeTHERankings();
    await randomDelay();
    
    const collegeBoardUniversities = await scrapeCollegeBoard();
    await randomDelay();
    
    const ucasUniversities = await scrapeUCAS();
    
    // 合併所有數據來源的結果
    allUniversities = [
      ...qsUniversities,
      ...usNewsUniversities,
      ...theUniversities,
      ...collegeBoardUniversities,
      ...ucasUniversities
    ];
    
    console.log(`成功從所有數據源爬取共 ${allUniversities.length} 所大學`);
    
    // 合併相同大學的數據
    const mergedUniversities = mergeUniversityData(allUniversities);
    
    // 保存到數據庫
    await saveUniversitiesToDatabase(mergedUniversities);
    
    // 同時保存到文件(作為備份)
    saveUniversitiesToJson(mergedUniversities);
    
    return mergedUniversities;
  } catch (error) {
    console.error('爬取過程中發生錯誤:', error);
    return [];
  }
};

// 合併來自不同來源的相同大學數據
const mergeUniversityData = (universities) => {
  console.log('開始合併重複大學數據...');
  const mergedMap = new Map();
  
  for (const uni of universities) {
    // 使用大學名稱作為键，但要注意清理和標準化
    const normalizedName = uni.name.toLowerCase().trim();
    
    if (mergedMap.has(normalizedName)) {
      // 如果已存在，合併數據
      const existingUni = mergedMap.get(normalizedName);
      mergedMap.set(normalizedName, {
        ...existingUni,
        // 如果現有數據沒有某個字段，但新數據有，則使用新數據的
        rank: existingUni.rank || uni.rank,
        country: existingUni.country || uni.country,
        city: existingUni.city || uni.city,
        state: existingUni.state || uni.state,
        location: existingUni.location || uni.location,
        score: existingUni.score || uni.score,
        // 來源信息合併為數組
        sources: [...(existingUni.sources || [existingUni.source]), uni.source].filter(Boolean),
        sourceUrls: [...(existingUni.sourceUrls || [existingUni.sourceUrl]), uni.sourceUrl].filter(Boolean),
        // 刪除單個source屬性
        source: undefined,
        sourceUrl: undefined,
      });
    } else {
      // 如果是新大學，添加到Map
      mergedMap.set(normalizedName, {
        ...uni,
        // 將source轉為sources數組
        sources: [uni.source].filter(Boolean),
        sourceUrls: [uni.sourceUrl].filter(Boolean),
        // 刪除單個source屬性
        source: undefined,
        sourceUrl: undefined,
      });
    }
  }
  
  // 將Map轉回數組
  const mergedUniversities = Array.from(mergedMap.values());
  console.log(`合併後共有 ${mergedUniversities.length} 所大學`);
  
  return mergedUniversities;
};

// 保存數據到數據庫
const saveUniversitiesToDatabase = async (universities) => {
  console.log(`開始將 ${universities.length} 所大學數據保存到數據庫...`);
  
  try {
    // 首先清除現有數據
    await prisma.school.deleteMany();
    console.log('已清除現有學校數據');
    
    // 批量插入學校數據
    const batchSize = 50;
    let insertCount = 0;
    
    for (let i = 0; i < universities.length; i += batchSize) {
      const batch = universities.slice(i, i + batchSize);
      const schoolData = batch.map(uni => {
        // 將大學數據轉換為School模型格式
        const rating = uni.score ? parseFloat(uni.score) : (Math.random() * 2 + 3); // 如果沒有分數，生成3-5的隨機分數
        const location = uni.location || `${uni.country} ${uni.city || ''}`;
        
        return {
          name: uni.name,
          description: `${uni.name}是一所位於${uni.country}的知名高等教育機構，在全球高等教育領域享有盛譽。`,
          location: location,
          country: uni.country,
          city: uni.city,
          website: uni.detailUrl || uni.sourceUrls?.[0] || '',
          imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(uni.name)}&background=random`,
          rating: rating > 5 ? 5 : (rating < 1 ? 3 : rating), // 確保評分在1-5之間
          tuition: Math.floor(Math.random() * 30000) + 10000, // 隨機學費10000-40000
          majors: '商業管理, 計算機科學, 工程學, 醫學, 法律, 藝術, 教育', // 示例專業
          facilities: '圖書館, 實驗室, 學生宿舍, 體育設施, 餐廳', // 示例設施
        };
      });
      
      // 執行批量插入
      const result = await prisma.school.createMany({
        data: schoolData,
        skipDuplicates: true, // 跳過重複項
      });
      
      insertCount += result.count;
      console.log(`已插入 ${insertCount}/${universities.length} 所學校`);
    }
    
    console.log(`成功將 ${insertCount} 所大學數據保存到數據庫`);
  } catch (error) {
    console.error('保存大學數據到數據庫時出錯:', error);
  }
};

// 保存數據到JSON文件(作為備份)
const saveUniversitiesToJson = (universities) => {
  try {
    const dataDir = path.join(__dirname, '../../../data');
    
    // 如果目錄不存在，創建目錄
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const jsonFilePath = path.join(dataDir, 'universities.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(universities, null, 2), 'utf8');
    
    console.log(`已將 ${universities.length} 所大學的數據保存到 ${jsonFilePath} (備份)`);
  } catch (error) {
    console.error('保存大學數據到文件時出錯:', error);
  }
};

// 獲取大學詳細信息
const getUniversityDetails = async (detailUrl, source) => {
  if (!detailUrl) return {};
  
  try {
    console.log(`正在爬取大學詳細信息: ${detailUrl}`);
    
    // 根據不同來源使用不同的爬取邏輯
    if (source && source.includes('QS')) {
      return await getQSUniversityDetails(detailUrl);
    } else if (source && source.includes('U.S. News')) {
      return await getUSNewsUniversityDetails(detailUrl);
    } else if (source && source.includes('THE')) {
      return await getTHEUniversityDetails(detailUrl);
    } else if (source && source.includes('College Board')) {
      return await getCollegeBoardUniversityDetails(detailUrl);
    } else if (source && source.includes('UCAS')) {
      return await getUCASUniversityDetails(detailUrl);
    }
    
    return {};
  } catch (error) {
    console.error(`爬取大學詳細信息失敗: ${detailUrl}`, error);
    return {};
  }
};

// QS大學詳細信息爬取
const getQSUniversityDetails = async (detailUrl) => {
  // 具體實現...
  return {};
};

// U.S. News大學詳細信息爬取
const getUSNewsUniversityDetails = async (detailUrl) => {
  // 具體實現...
  return {};
};

// THE大學詳細信息爬取
const getTHEUniversityDetails = async (detailUrl) => {
  // 具體實現...
  return {};
};

// College Board大學詳細信息爬取
const getCollegeBoardUniversityDetails = async (detailUrl) => {
  // 具體實現...
  return {};
};

// UCAS大學詳細信息爬取
const getUCASUniversityDetails = async (detailUrl) => {
  // 具體實現...
  return {};
};

module.exports = {
  scrapeAllUniversities,
  scrapeQSRankings,
  scrapeUSNews,
  scrapeTHERankings,
  scrapeCollegeBoard,
  scrapeUCAS,
  getUniversityDetails,
}; 