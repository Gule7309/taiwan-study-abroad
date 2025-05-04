// 清理學校數據腳本
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  try {
    console.log('開始清理數據庫中的學校數據...');
    
    // 獲取當前學校數量
    const beforeCount = await prisma.school.count();
    console.log(`清理前數據庫中有 ${beforeCount} 所學校`);
    
    // 刪除所有學校
    await prisma.school.deleteMany();
    
    // 驗證刪除結果
    const afterCount = await prisma.school.count();
    console.log(`清理完成，數據庫中剩餘 ${afterCount} 所學校`);
    
    console.log('學校數據已全部清理完成！');
  } catch (error) {
    console.error('清理學校數據時發生錯誤:', error);
    process.exit(1);
  } finally {
    // 關閉數據庫連接
    await prisma.$disconnect();
  }
};

// 執行腳本
main(); 