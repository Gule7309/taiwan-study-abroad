import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 添加默認導出，兼容兩種導入方式
export default prisma;

// 測試資料庫連接函數
export async function testDatabaseConnection() {
  try {
    // 動態判斷資料庫類型
    const url = process.env.DATABASE_URL || '';
    
    if (url.startsWith('file:')) {
      // SQLite 
      const user = await prisma.user.findFirst();
      return { 
        connected: true, 
        message: '資料庫連接成功 (SQLite)', 
        databaseType: 'sqlite'
      };
    } else if (url.includes('mongodb') || url.includes('mongo+srv')) {
      // MongoDB
      await prisma.$runCommandRaw({ ping: 1 });
      return { 
        connected: true, 
        message: '資料庫連接成功 (MongoDB)', 
        databaseType: 'mongodb'
      };
    } else {
      // 其他資料庫
      await prisma.$queryRaw`SELECT 1`;
      return { 
        connected: true, 
        message: '資料庫連接成功', 
        databaseType: 'other'
      };
    }
  } catch (error) {
    console.error('資料庫連接錯誤:', error);
    return { 
      connected: false, 
      message: '資料庫連接失敗', 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 