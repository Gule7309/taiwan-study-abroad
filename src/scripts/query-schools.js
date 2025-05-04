const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function querySchools() {
  try {
    console.log('正在查詢學校資料...');
    
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    console.log(`查詢到 ${schools.length} 所學校:`);
    
    schools.forEach((school, index) => {
      console.log(`${index + 1}. ${school.name} - ${school.location} (評分: ${school.rating})`);
    });
    
  } catch (error) {
    console.error('查詢學校資料時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

querySchools(); 