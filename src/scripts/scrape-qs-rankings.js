const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

async function scrapeQSRankings() {
  try {
    console.log('開始爬取 QS 世界大學排名資料...');
    
    // 基於 QS 排名的頂尖大學數據
    // 資料來源: https://www.topuniversities.com/university-rankings
    const topUniversities = [
      // 美國
      {
        name: '麻省理工學院',
        description: '全球頂尖理工學院，在工程、科學、計算機科學等領域居世界領先地位',
        location: '美國 麻薩諸塞州 劍橋市',
        website: 'https://www.mit.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png',
        rating: 5.0,
      },
      {
        name: '史丹佛大學',
        description: '美國頂尖私立研究型大學，位於矽谷，在創新、創業和研究領域享有盛譽',
        location: '美國 加利福尼亞州 史丹佛',
        website: 'https://www.stanford.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png',
        rating: 5.0,
      },
      {
        name: '哈佛大學',
        description: '美國常春藤盟校之一，歷史悠久的世界頂尖大學，在法律、醫學和商業領域尤為卓越',
        location: '美國 麻薩諸塞州 劍橋市',
        website: 'https://www.harvard.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png',
        rating: 5.0,
      },
      {
        name: '加州理工學院',
        description: '世界頂尖科研機構，在自然科學和工程領域享有盛譽，師生比例極低',
        location: '美國 加利福尼亞州 帕薩迪納',
        website: 'https://www.caltech.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Caltech_seal.svg/1200px-Caltech_seal.svg.png',
        rating: 4.9,
      },
      {
        name: '普林斯頓大學',
        description: '美國常春藤盟校之一，以卓越的教學和研究著稱，在數學和物理學領域尤其強大',
        location: '美國 新澤西州 普林斯頓',
        website: 'https://www.princeton.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Princeton_shield.svg/1200px-Princeton_shield.svg.png',
        rating: 4.9,
      },
      
      // 英國
      {
        name: '牛津大學',
        description: '英國最古老的大學，世界頂級學府，在人文、科學、醫學等多領域享有盛譽',
        location: '英國 牛津',
        website: 'https://www.ox.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1200px-Oxford-University-Circlet.svg.png',
        rating: 4.9,
      },
      {
        name: '劍橋大學',
        description: '英國最古老的大學之一，世界頂級學府，在科學、數學和工程領域尤為卓越',
        location: '英國 劍橋',
        website: 'https://www.cam.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/University_of_Cambridge_coat_of_arms_official.svg/1200px-University_of_Cambridge_coat_of_arms_official.svg.png',
        rating: 4.9,
      },
      {
        name: '倫敦帝國理工學院',
        description: '英國頂尖理工科大學，專注於科學、工程、醫學和商業領域的教學和研究',
        location: '英國 倫敦',
        website: 'https://www.imperial.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Imperial_College_London_crest.svg/1200px-Imperial_College_London_crest.svg.png',
        rating: 4.8,
      },
      {
        name: '倫敦大學學院',
        description: '英國頂尖研究型大學，在藝術、人文、科學、社會科學和醫學領域廣受認可',
        location: '英國 倫敦',
        website: 'https://www.ucl.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/UCL_logo.svg/1200px-UCL_logo.svg.png',
        rating: 4.8,
      },
      {
        name: '愛丁堡大學',
        description: '蘇格蘭最古老的大學之一，在醫學、科學、工程和人文學科領域享有盛譽',
        location: '英國 蘇格蘭 愛丁堡',
        website: 'https://www.ed.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/University_of_Edinburgh_ceremonial_crest.svg/1200px-University_of_Edinburgh_ceremonial_crest.svg.png',
        rating: 4.7,
      },
      
      // 中國
      {
        name: '清華大學',
        description: '中國頂尖理工科大學，在工程、科學和計算機科學領域享有國際聲譽',
        location: '中國 北京',
        website: 'https://www.tsinghua.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Tsinghua_University_Logo.svg/1200px-Tsinghua_University_Logo.svg.png',
        rating: 4.8,
      },
      {
        name: '北京大學',
        description: '中國最古老的大學之一，在人文、科學和醫學領域享有盛譽',
        location: '中國 北京',
        website: 'https://www.pku.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Peking_University_logo.svg/1200px-Peking_University_logo.svg.png',
        rating: 4.8,
      },
      {
        name: '浙江大學',
        description: '中國綜合性研究型大學，在工程、醫學和科學領域表現出色',
        location: '中國 浙江 杭州',
        website: 'https://www.zju.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Zhejiang_University_Logo.svg/1200px-Zhejiang_University_Logo.svg.png',
        rating: 4.7,
      },
      {
        name: '復旦大學',
        description: '中國頂尖綜合性大學，在醫學、經濟學和人文學科領域享有盛譽',
        location: '中國 上海',
        website: 'https://www.fudan.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Fudan_University_Logo.svg/1200px-Fudan_University_Logo.svg.png',
        rating: 4.7,
      },
      {
        name: '上海交通大學',
        description: '中國古老的頂尖大學，在工程、醫學和管理學領域享有盛譽',
        location: '中國 上海',
        website: 'https://www.sjtu.edu.cn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Shanghai_Jiao_Tong_University_Logo.svg/1200px-Shanghai_Jiao_Tong_University_Logo.svg.png',
        rating: 4.7,
      },
      
      // 日本
      {
        name: '東京大學',
        description: '日本最負盛名的大學，在科學、醫學和工程領域享有國際聲譽',
        location: '日本 東京',
        website: 'https://www.u-tokyo.ac.jp',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_Tokyo_logo.svg/1200px-University_of_Tokyo_logo.svg.png',
        rating: 4.8,
      },
      {
        name: '京都大學',
        description: '日本頂尖研究型大學，在基礎科學、醫學和工程方面享有盛譽',
        location: '日本 京都',
        website: 'https://www.kyoto-u.ac.jp',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kyoto_University_Logo.svg/1200px-Kyoto_University_Logo.svg.png',
        rating: 4.7,
      },
      {
        name: '大阪大學',
        description: '日本著名研究型大學，在醫學、工程和物理學領域表現卓越',
        location: '日本 大阪',
        website: 'https://www.osaka-u.ac.jp',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Osaka_University_logo.svg/1200px-Osaka_University_logo.svg.png',
        rating: 4.6,
      },
      {
        name: '東北大學',
        description: '日本頂尖研究型大學，在材料科學、物理學和工程領域享有聲譽',
        location: '日本 仙台',
        website: 'https://www.tohoku.ac.jp',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tohoku_University_Logo.svg/1200px-Tohoku_University_Logo.svg.png',
        rating: 4.6,
      },
      
      // 加拿大
      {
        name: '多倫多大學',
        description: '加拿大頂尖研究型大學，在醫學、工程和人文學科等領域享有國際聲譽',
        location: '加拿大 安大略省 多倫多',
        website: 'https://www.utoronto.ca',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/University_of_Toronto_coat_of_arms.svg/1200px-University_of_Toronto_coat_of_arms.svg.png',
        rating: 4.8,
      },
      {
        name: '麥吉爾大學',
        description: '加拿大歷史悠久的頂尖大學，在醫學、工程和商業領域享有盛譽',
        location: '加拿大 魁北克省 蒙特利爾',
        website: 'https://www.mcgill.ca',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/McGill_University_CoA.svg/1200px-McGill_University_CoA.svg.png',
        rating: 4.7,
      },
      {
        name: '英屬哥倫比亞大學',
        description: '加拿大頂尖研究型大學，在環境科學、醫學和商業領域表現卓越',
        location: '加拿大 英屬哥倫比亞省 溫哥華',
        website: 'https://www.ubc.ca',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/UBC_coat_of_arms.svg/1200px-UBC_coat_of_arms.svg.png',
        rating: 4.7,
      },
      
      // 澳大利亞
      {
        name: '澳洲國立大學',
        description: '澳洲頂尖研究型大學，在科學、法律和公共政策領域表現出色',
        location: '澳洲 首都領地 坎培拉',
        website: 'https://www.anu.edu.au',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Australian_National_University_coat_of_arms.svg/1200px-Australian_National_University_coat_of_arms.svg.png',
        rating: 4.7,
      },
      {
        name: '墨爾本大學',
        description: '澳洲最古老的大學之一，在醫學、法律和工程領域享有國際聲譽',
        location: '澳洲 維多利亞州 墨爾本',
        website: 'https://www.unimelb.edu.au',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png',
        rating: 4.7,
      },
      {
        name: '悉尼大學',
        description: '澳洲歷史最悠久的大學，在醫學、工程和人文學科領域表現出色',
        location: '澳洲 新南威爾士州 悉尼',
        website: 'https://www.sydney.edu.au',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Sydney_Uni_CMYK_stacked.svg/1200px-Sydney_Uni_CMYK_stacked.svg.png',
        rating: 4.6,
      },
      
      // 新加坡
      {
        name: '新加坡國立大學',
        description: '新加坡頂尖研究型大學，在工程、醫學和商業領域享有國際聲譽',
        location: '新加坡',
        website: 'https://www.nus.edu.sg',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/National_University_of_Singapore_logo.svg/1200px-National_University_of_Singapore_logo.svg.png',
        rating: 4.8,
      },
      {
        name: '南洋理工大學',
        description: '新加坡頂尖理工科大學，在工程、商業和計算機科學領域享有盛譽',
        location: '新加坡',
        website: 'https://www.ntu.edu.sg',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Nanyang_Technological_University_coat_of_arms_vector.svg/1200px-Nanyang_Technological_University_coat_of_arms_vector.svg.png',
        rating: 4.8,
      },
      
      // 香港
      {
        name: '香港大學',
        description: '香港歷史最悠久的大學，在醫學、法律和商業等領域享有國際聲譽',
        location: '中國 香港',
        website: 'https://www.hku.hk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/The_University_of_Hong_Kong_Logo.svg/1200px-The_University_of_Hong_Kong_Logo.svg.png',
        rating: 4.7,
      },
      {
        name: '香港中文大學',
        description: '香港頂尖研究型大學，在醫學、商業和工程領域表現出色',
        location: '中國 香港',
        website: 'https://www.cuhk.edu.hk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/CUHK_Logo.svg/1200px-CUHK_Logo.svg.png',
        rating: 4.6,
      },
      {
        name: '香港科技大學',
        description: '香港領先的理工科大學，在工程、商業和計算機科學領域享有盛譽',
        location: '中國 香港',
        website: 'https://www.ust.hk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/HKUST_Logo.svg/1200px-HKUST_Logo.svg.png',
        rating: 4.7,
      },
      
      // 台灣
      {
        name: '國立臺灣大學',
        description: '台灣最負盛名的大學，在醫學、工程和自然科學領域享有聲譽',
        location: '台灣 台北',
        website: 'https://www.ntu.edu.tw',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/National_Taiwan_University_seal.svg/1200px-National_Taiwan_University_seal.svg.png',
        rating: 4.6,
      },
      {
        name: '國立清華大學',
        description: '台灣頂尖理工科大學，在工程、科學和計算機領域表現卓越',
        location: '台灣 新竹',
        website: 'https://www.nthu.edu.tw',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/33/NTHU_Round_seal.svg/1200px-NTHU_Round_seal.svg.png',
        rating: 4.5,
      }
    ];
    
    console.log(`成功整理 ${topUniversities.length} 所世界頂尖大學資料`);
    return topUniversities;
  } catch (error) {
    console.error('處理大學資料時出錯:', error);
    return [];
  }
}

async function main() {
  try {
    console.log('開始更新學校資料庫 (基於 QS 排名)...');

    const universities = await scrapeQSRankings();

    // 對於每所大學，檢查是否已存在，如果不存在則創建
    for (const university of universities) {
      const existingSchool = await prisma.school.findFirst({
        where: {
          name: university.name,
        },
      });

      if (!existingSchool) {
        await prisma.school.create({
          data: university,
        });
        console.log(`已新增: ${university.name}`);
      } else {
        console.log(`已存在，跳過: ${university.name}`);
      }
    }

    console.log('基於 QS 排名的學校資料庫更新完成！');
  } catch (error) {
    console.error('更新學校資料庫時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 