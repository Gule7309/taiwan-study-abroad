// 使用JavaScript版本以避免TypeScript相關問題
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // 獲取所有用戶（不包含密碼）
    console.log('==== 用戶 ====');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    console.log(`共找到 ${users.length} 個用戶：`);
    console.log(JSON.stringify(users, null, 2));
    console.log('\n');

    // 獲取所有學校
    console.log('==== 學校 ====');
    const schools = await prisma.school.findMany();
    console.log(`共找到 ${schools.length} 所學校：`);
    console.log(JSON.stringify(schools, null, 2));
    console.log('\n');

    // 獲取所有社區貼文
    console.log('==== 社區貼文 ====');
    const posts = await prisma.community.findMany();
    console.log(`共找到 ${posts.length} 篇貼文：`);
    console.log(JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('查詢資料庫時發生錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 