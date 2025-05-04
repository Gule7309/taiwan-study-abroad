const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMoreSchools() {
  try {
    console.log('開始添加更多亞洲地區學校資料...');
    
    // 添加更多亞洲地區的頂尖大學
    const asianSchools = [
      {
        name: '清華大學',
        description: '中國頂尖理工科大學，在工程、科學和計算機科學領域享有國際聲譽',
        location: '中國 北京',
        website: 'https://www.tsinghua.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Tsinghua_University_Logo.svg/1200px-Tsinghua_University_Logo.svg.png',
        rating: 4.8,
      },
      {
        name: '南洋理工大學',
        description: '新加坡頂尖研究型大學，在工程、商業和計算機科學領域享有國際聲譽',
        location: '新加坡',
        website: 'https://www.ntu.edu.sg',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Nanyang_Technological_University_coat_of_arms_vector.svg/1200px-Nanyang_Technological_University_coat_of_arms_vector.svg.png',
        rating: 4.7,
      },
      {
        name: '首爾國立大學',
        description: '韓國最負盛名的大學，在科學、工程和醫學領域享有國際聲譽',
        location: '韓國 首爾',
        website: 'https://www.snu.ac.kr',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Seoul_National_University_emblem.svg/1200px-Seoul_National_University_emblem.svg.png',
        rating: 4.6,
      },
      {
        name: '東京工業大學',
        description: '日本頂尖理工科大學，在工程和自然科學領域享有國際聲譽',
        location: '日本 東京',
        website: 'https://www.titech.ac.jp',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Tokyo_Tech_logo.svg/1200px-Tokyo_Tech_logo.svg.png',
        rating: 4.6,
      },
      {
        name: '台灣大學',
        description: '台灣最古老、最負盛名的大學，在醫學、工程和科學領域享有國際聲譽',
        location: '台灣 台北',
        website: 'https://www.ntu.edu.tw',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/National_Taiwan_University_seal.svg/1200px-National_Taiwan_University_seal.svg.png',
        rating: 4.6,
      },
      {
        name: '香港科技大學',
        description: '香港頂尖研究型大學，在商業、工程和科學領域享有國際聲譽',
        location: '中國 香港',
        website: 'https://www.ust.hk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/HKUST_Logo.svg/1200px-HKUST_Logo.svg.png',
        rating: 4.7,
      },
      {
        name: '復旦大學',
        description: '中國頂尖綜合性大學，在醫學、商業和人文學科領域享有盛譽',
        location: '中國 上海',
        website: 'https://www.fudan.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Fudan_University_Logo.svg/1200px-Fudan_University_Logo.svg.png',
        rating: 4.6,
      },
      {
        name: '中央大學',
        description: '韓國頂尖私立大學，在商業、工程和計算機科學領域享有聲譽',
        location: '韓國 首爾',
        website: 'https://www.korea.ac.kr',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Korea_University_Global_Symbol_Mark.svg/1200px-Korea_University_Global_Symbol_Mark.svg.png',
        rating: 4.5,
      }
    ];
    
    // 對於每所學校，檢查是否已存在，如果不存在則創建
    for (const school of asianSchools) {
      const existingSchool = await prisma.school.findFirst({
        where: {
          name: school.name,
        },
      });

      if (!existingSchool) {
        await prisma.school.create({
          data: school,
        });
        console.log(`已新增: ${school.name}`);
      } else {
        console.log(`已存在，跳過: ${school.name}`);
      }
    }

    console.log('亞洲學校資料添加完成！');
  } catch (error) {
    console.error('添加更多學校資料時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreSchools(); 