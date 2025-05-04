const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

async function scrapeTopSchools() {
  try {
    console.log('開始爬取學校資料...');
    
    // 這裡模擬爬取世界頂級大學數據
    // 在實際情況中，你應該替換為實際的網站URL和選擇器
    const schools = [
      {
        name: '麻省理工學院',
        description: '美國頂尖的理工科大學，在工程、科學、計算機科學等領域享有世界聲譽',
        location: '美國 麻薩諸塞州 劍橋市',
        website: 'https://www.mit.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png',
        rating: 4.9,
      },
      {
        name: '史丹佛大學',
        description: '美國頂尖私立研究型大學，位於矽谷，在創新、創業和工程領域享有盛譽',
        location: '美國 加利福尼亞州 史丹佛',
        website: 'https://www.stanford.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png',
        rating: 4.9,
      },
      {
        name: '劍橋大學',
        description: '英國最古老的大學之一，世界頂級學府，享有卓越的學術聲譽',
        location: '英國 劍橋',
        website: 'https://www.cam.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/University_of_Cambridge_coat_of_arms_official.svg/1200px-University_of_Cambridge_coat_of_arms_official.svg.png',
        rating: 4.8,
      },
      {
        name: '東京大學',
        description: '日本最負盛名的大學，亞洲頂尖學府，在科學研究和創新領域享有國際聲譽',
        location: '日本 東京',
        website: 'https://www.u-tokyo.ac.jp',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_Tokyo_logo.svg/1200px-University_of_Tokyo_logo.svg.png',
        rating: 4.7,
      },
      {
        name: '北京大學',
        description: '中國頂尖學府，在學術研究和人才培養方面享有盛譽',
        location: '中國 北京',
        website: 'https://www.pku.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Peking_University_logo.svg/1200px-Peking_University_logo.svg.png',
        rating: 4.7,
      },
      {
        name: '蘇黎世聯邦理工學院',
        description: '瑞士頂尖理工科大學，在科學、工程和技術領域享有世界聲譽',
        location: '瑞士 蘇黎世',
        website: 'https://ethz.ch',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/ETH_Zurich_Logo.svg/1200px-ETH_Zurich_Logo.svg.png',
        rating: 4.8,
      },
      {
        name: '多倫多大學',
        description: '加拿大頂尖大學，在醫學、工程和人文學科等領域享有國際聲譽',
        location: '加拿大 安大略省 多倫多',
        website: 'https://www.utoronto.ca',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/University_of_Toronto_coat_of_arms.svg/1200px-University_of_Toronto_coat_of_arms.svg.png',
        rating: 4.6,
      },
      {
        name: '新加坡國立大學',
        description: '新加坡最古老的大學，亞洲頂尖學府，在商業、工程和計算機科學領域享有盛譽',
        location: '新加坡',
        website: 'https://www.nus.edu.sg',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/National_University_of_Singapore_logo.svg/1200px-National_University_of_Singapore_logo.svg.png',
        rating: 4.7,
      },
      {
        name: '香港大學',
        description: '香港最古老的大學，在醫學、商業和法律等領域享有國際聲譽',
        location: '中國 香港',
        website: 'https://www.hku.hk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/The_University_of_Hong_Kong_Logo.svg/1200px-The_University_of_Hong_Kong_Logo.svg.png',
        rating: 4.6,
      },
      {
        name: '墨爾本大學',
        description: '澳洲最古老的大學之一，在醫學、法律和人文學科等領域享有國際聲譽',
        location: '澳洲 維多利亞州 墨爾本',
        website: 'https://www.unimelb.edu.au',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png',
        rating: 4.7,
      }
    ];
    
    console.log(`成功抓取 ${schools.length} 所學校資料`);
    return schools;
  } catch (error) {
    console.error('爬取學校資料時出錯:', error);
    return [];
  }
}

// 實際爬取特定網站的示例函數
async function scrapeRealWebsite() {
  try {
    // 這裡是示例代碼，在實際使用時應替換為目標網站
    const response = await axios.get('https://www.timeshighereducation.com/world-university-rankings');
    const $ = cheerio.load(response.data);
    const schools = [];
    
    // 根據網頁結構選擇合適的選擇器
    $('.ranking-row').each((_, element) => {
      const name = $(element).find('.ranking-institution-title').text().trim();
      const location = $(element).find('.location').text().trim();
      
      // 這裡只是示例，實際爬取時需要根據網頁結構調整
      schools.push({
        name,
        description: `${name}是一所知名學府，提供優質的教育和研究機會。`,
        location,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.edu`,
        imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        rating: 4.5,
      });
    });
    
    return schools;
  } catch (error) {
    console.error('爬取真實網站時出錯:', error);
    return [];
  }
}

async function main() {
  try {
    console.log('開始更新學校資料庫...');

    // 使用模擬數據而非實際爬取
    const schools = await scrapeTopSchools();
    // const schools = await scrapeRealWebsite(); // 取消註釋以使用實際爬取

    // 對於每所學校，檢查是否已存在，如果不存在則創建
    for (const school of schools) {
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

    console.log('學校資料庫更新完成！');
  } catch (error) {
    console.error('更新學校資料庫時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 