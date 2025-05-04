// 執行爬蟲腳本
const { scrapeAllUniversities } = require('../src/lib/scrapers/universityScrapers');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  console.log('開始執行大學數據爬蟲...');
  
  try {
    // 執行爬蟲
    await scrapeAllUniversities();
    
    // 獲取學校數量
    const count = await prisma.school.count();
    console.log(`爬蟲完成，數據庫中共有 ${count} 所學校`);
    
    console.log('爬蟲任務完成！數據已保存到數據庫和備份文件');
  } catch (error) {
    console.error('爬蟲過程中發生錯誤:', error);
    process.exit(1);
  } finally {
    // 關閉數據庫連接
    await prisma.$disconnect();
  }
};

main(); 