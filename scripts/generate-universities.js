const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 定義要生成大學資料的國家列表 (至少20個國家)
const countries = [
  { name: '美國', englishName: 'United States' },
  { name: '英國', englishName: 'United Kingdom' },
  { name: '加拿大', englishName: 'Canada' },
  { name: '澳大利亞', englishName: 'Australia' },
  { name: '中國', englishName: 'China' },
  { name: '日本', englishName: 'Japan' },
  { name: '新加坡', englishName: 'Singapore' },
  { name: '德國', englishName: 'Germany' },
  { name: '法國', englishName: 'France' },
  { name: '瑞士', englishName: 'Switzerland' },
  { name: '荷蘭', englishName: 'Netherlands' },
  { name: '瑞典', englishName: 'Sweden' },
  { name: '南韓', englishName: 'South Korea' },
  { name: '香港', englishName: 'Hong Kong' },
  { name: '紐西蘭', englishName: 'New Zealand' },
  { name: '意大利', englishName: 'Italy' },
  { name: '西班牙', englishName: 'Spain' },
  { name: '愛爾蘭', englishName: 'Ireland' },
  { name: '丹麥', englishName: 'Denmark' },
  { name: '挪威', englishName: 'Norway' },
  { name: '芬蘭', englishName: 'Finland' },
  { name: '比利時', englishName: 'Belgium' },
  { name: '奧地利', englishName: 'Austria' },
  { name: '俄羅斯', englishName: 'Russia' }
];

// 為每個國家創建一些知名大學
const topUniversities = {
  '美國': [
    { name: '哈佛大學', rating: 4.9, city: '劍橋' },
    { name: '麻省理工學院', rating: 4.9, city: '劍橋' },
    { name: '斯坦福大學', rating: 4.8, city: '斯坦福' },
    { name: '普林斯頓大學', rating: 4.8, city: '普林斯頓' },
    { name: '加州理工學院', rating: 4.8, city: '帕薩迪納' },
    { name: '芝加哥大學', rating: 4.7, city: '芝加哥' },
    { name: '賓夕法尼亞大學', rating: 4.7, city: '費城' },
    { name: '耶魯大學', rating: 4.7, city: '紐黑文' },
    { name: '哥倫比亞大學', rating: 4.7, city: '紐約' },
    { name: '康奈爾大學', rating: 4.6, city: '伊薩卡' }
  ],
  '英國': [
    { name: '牛津大學', rating: 4.8, city: '牛津' },
    { name: '劍橋大學', rating: 4.8, city: '劍橋' },
    { name: '倫敦帝國學院', rating: 4.7, city: '倫敦' },
    { name: '倫敦大學學院', rating: 4.7, city: '倫敦' },
    { name: '愛丁堡大學', rating: 4.6, city: '愛丁堡' },
    { name: '曼徹斯特大學', rating: 4.6, city: '曼徹斯特' },
    { name: '倫敦國王學院', rating: 4.5, city: '倫敦' },
    { name: '倫敦政治經濟學院', rating: 4.5, city: '倫敦' },
    { name: '布里斯托大學', rating: 4.5, city: '布里斯托' },
    { name: '華威大學', rating: 4.5, city: '考文垂' }
  ],
  '加拿大': [
    { name: '多倫多大學', rating: 4.7, city: '多倫多' },
    { name: '麥吉爾大學', rating: 4.7, city: '蒙特利爾' },
    { name: '英屬哥倫比亞大學', rating: 4.6, city: '溫哥華' },
    { name: '阿爾伯塔大學', rating: 4.5, city: '埃德蒙頓' },
    { name: '滑鐵盧大學', rating: 4.5, city: '滑鐵盧' }
  ],
  '中國': [
    { name: '清華大學', rating: 4.7, city: '北京' },
    { name: '北京大學', rating: 4.7, city: '北京' },
    { name: '復旦大學', rating: 4.6, city: '上海' },
    { name: '上海交通大學', rating: 4.6, city: '上海' },
    { name: '浙江大學', rating: 4.5, city: '杭州' }
  ],
  '澳大利亞': [
    { name: '墨爾本大學', rating: 4.6, city: '墨爾本' },
    { name: '悉尼大學', rating: 4.6, city: '悉尼' },
    { name: '澳大利亞國立大學', rating: 4.6, city: '堪培拉' },
    { name: '昆士蘭大學', rating: 4.5, city: '布里斯班' },
    { name: '新南威爾士大學', rating: 4.5, city: '悉尼' }
  ]
};

// 城市名稱列表，用於生成其他大學所在地
const cities = {
  '美國': ['紐約', '洛杉磯', '芝加哥', '休士頓', '費城', '鳳凰城', '聖安東尼奧', '聖地牙哥', '達拉斯', '波士頓'],
  '英國': ['倫敦', '伯明翰', '曼徹斯特', '利茲', '格拉斯哥', '謝菲爾德', '利物浦', '布里斯托', '諾丁漢', '紐卡斯爾'],
  '加拿大': ['多倫多', '蒙特利爾', '溫哥華', '卡加里', '渥太華', '埃德蒙頓', '密西沙加', '溫尼伯', '魁北克', '漢密爾頓'],
  '澳大利亞': ['悉尼', '墨爾本', '布里斯班', '珀斯', '阿德萊德', '黃金海岸', '堪培拉', '紐卡斯爾', '伍倫貢', '霍巴特'],
  '中國': ['北京', '上海', '廣州', '深圳', '杭州', '重慶', '武漢', '西安', '成都', '南京']
};

// 為其他國家添加城市
cities['日本'] = ['東京', '大阪', '京都', '名古屋', '福岡', '札幌', '神戶', '橫濱', '廣島', '仙台'];
cities['新加坡'] = ['新加坡'];
cities['德國'] = ['柏林', '慕尼黑', '法蘭克福', '漢堡', '科隆', '斯圖加特', '杜塞爾多夫', '萊比錫', '德勒斯登', '漢諾威'];
cities['法國'] = ['巴黎', '馬賽', '里昂', '圖盧茲', '尼斯', '南特', '斯特拉斯堡', '蒙彼利埃', '波爾多', '里爾'];
cities['瑞士'] = ['蘇黎世', '日內瓦', '巴塞爾', '伯爾尼', '洛桑', '盧塞恩', '聖加侖', '盧加諾', '溫特圖爾', '沙夫豪森'];
cities['荷蘭'] = ['阿姆斯特丹', '鹿特丹', '海牙', '烏得勒支', '埃因霍溫', '格羅寧根', '提爾堡', '阿爾梅勒', '布雷達', '奈梅亨'];
cities['瑞典'] = ['斯德哥爾摩', '哥德堡', '馬爾默', '烏普薩拉', '林雪平', '韋斯特羅斯', '厄勒布魯', '赫爾辛堡', '延雪平', '烏梅奧'];
cities['南韓'] = ['首爾', '釜山', '仁川', '大邱', '大田', '光州', '蔚山', '水原', '昌原', '濟州'];
cities['香港'] = ['香港'];
cities['紐西蘭'] = ['奧克蘭', '基督城', '惠靈頓', '漢密爾頓', '但尼丁', '塔烏蘭加', '北岸', '納爾遜', '黑斯廷斯', '因沃卡吉爾'];
cities['意大利'] = ['羅馬', '米蘭', '那不勒斯', '都靈', '巴勒莫', '熱那亞', '博洛尼亞', '佛羅倫薩', '卡塔尼亞', '威尼斯'];
cities['西班牙'] = ['馬德里', '巴塞羅那', '瓦倫西亞', '塞維利亞', '薩拉戈薩', '馬拉加', '穆爾西亞', '帕爾馬', '拉斯帕爾馬斯', '畢爾巴鄂'];
cities['愛爾蘭'] = ['都柏林', '科克', '利默里克', '戈爾韋', '沃特福德', '德羅赫達', '鄧多克', '斯萊戈', '基爾肯尼', '卡羅'];
cities['丹麥'] = ['哥本哈根', '奧胡斯', '歐登塞', '奧爾堡', '埃斯比約', '羅斯基勒', '科靈', '赫爾辛格', '希勒勒茲', '霍爾斯特布羅'];
cities['挪威'] = ['奧斯陸', '卑爾根', '特隆赫姆', '斯塔萬格', '德拉門', '弗雷德里克斯塔', '波爾斯格倫', '特羅姆瑟', '桑德尼斯', '莫斯'];
cities['芬蘭'] = ['赫爾辛基', '埃斯波', '坦佩雷', '萬塔', '奧盧', '圖爾庫', '于韋斯屈萊', '拉赫蒂', '庫奧皮奧', '約恩蘇'];
cities['比利時'] = ['布魯塞爾', '安特衛普', '根特', '布魯日', '列日', '沙勒羅瓦', '朗德爾澤勒', '莫倫比克', '魯汶', '哈瑟爾特'];
cities['奧地利'] = ['維也納', '格拉茨', '林茨', '薩爾茨堡', '因斯布魯克', '克拉根福特', '菲拉赫', '韋爾斯', '聖珀爾滕', '多恩比恩'];
cities['俄羅斯'] = ['莫斯科', '聖彼得堡', '新西伯利亞', '葉卡捷琳堡', '下諾夫哥羅德', '喀山', '車里雅賓斯克', '薩馬拉', '烏法', '羅斯托夫'];

// 大學類型
const universityTypes = ['大學', '學院', '理工學院', '科技大學', '師範大學', '商學院', '醫學院', '藝術學院', '政治學院', '經濟學院'];

// 專業領域
const majorFields = [
  '商業管理', '計算機科學', '工程學', '醫學', '法律', '藝術', '教育', '傳媒', '社會科學', '自然科學',
  '農業', '建築', '環境科學', '生物技術', '心理學', '語言學', '歷史', '哲學', '體育', '餐飲管理',
  '動漫設計', '電子競技', '人工智能', '大數據分析', '數字媒體', '金融科技', '可持續發展', '全球衛生', '國際關係', '城市規劃'
];

// 設施類型
const facilityTypes = [
  '圖書館', '體育場', '實驗室', '學生宿舍', '餐廳', '藝術中心', '醫療中心', '健身中心', '游泳池', '學生會大樓',
  '就業中心', '國際學生服務中心', '表演藝術中心', '研究中心', '創新中心', '創業孵化器', '語言中心', '環保中心', '文化交流中心', '科技園'
];

// 生成隨機描述
function generateDescription(name, country, city, specialties = []) {
  const intros = [
    `${name}是${country}${city}的一所知名高等教育機構`,
    `創建於${1800 + Math.floor(Math.random() * 200)}年的${name}位於${country}${city}`,
    `${name}坐落在${country}美麗的${city}市`,
    `作為${country}頂尖的高等教育機構之一，${name}位於${city}市中心`
  ];
  
  const specialtiesText = specialties.length > 0 
    ? `學校在${specialties.join('、')}等領域享有盛譽` 
    : `學校提供多樣化的學術課程`;
  
  const extras = [
    `擁有現代化的校園設施和優秀的師資隊伍`,
    `致力於培養具有國際視野和創新精神的人才`,
    `擁有來自世界各地的學生和教授`,
    `注重理論與實踐相結合的教學模式`
  ];
  
  const conclusion = [
    `是學生追求卓越教育的理想選擇。`,
    `為學生提供了一個優質的學習環境。`,
    `歡迎來自世界各地的學生加入這個多元文化的大家庭。`,
    `致力於為社會培養具有全球競爭力的人才。`
  ];
  
  const intro = intros[Math.floor(Math.random() * intros.length)];
  const extra = extras[Math.floor(Math.random() * extras.length)];
  const end = conclusion[Math.floor(Math.random() * conclusion.length)];
  
  return `${intro}，${specialtiesText}。學校${extra}，${end}`;
}

// 生成隨機大學網站URL
function generateWebsite(name, country) {
  // 替換空格和特殊字符
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '')
    .replace(/\s+/g, '');
  
  const domains = {
    '美國': '.edu',
    '英國': '.ac.uk',
    '加拿大': '.ca',
    '澳大利亞': '.edu.au',
    '中國': '.edu.cn',
    '日本': '.ac.jp',
    '新加坡': '.edu.sg',
    '德國': '.de',
    '法國': '.fr',
    '瑞士': '.ch',
    '荷蘭': '.nl',
    '瑞典': '.se',
    '南韓': '.ac.kr',
    '香港': '.edu.hk',
    '紐西蘭': '.ac.nz'
  };
  
  // 默認域名後綴
  const domainSuffix = domains[country] || '.edu';
  
  // 生成網站URL
  return `https://www.${cleanName}${domainSuffix}`;
}

// 生成隨機大學Logo URL
function generateLogoUrl(name, country) {
  // 簡化名稱作為文件名
  const fileName = name.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '')
    .replace(/\s+/g, '-');
  
  return `https://example.com/logos/${country}/${fileName}.png`;
}

// 生成大學資料
async function generateUniversities() {
  console.log('開始生成大學資料...');
  
  const allUniversities = [];
  
  // 為每個國家生成大學
  for (const country of countries) {
    console.log(`正在為 ${country.name} 生成大學資料...`);
    
    const countryUniversities = [];
    const countryName = country.name;
    const countryCities = cities[countryName] || ['未知城市'];
    
    // 添加已知的頂尖大學
    if (topUniversities[countryName]) {
      for (const univ of topUniversities[countryName]) {
        // 隨機選擇2-4個專業領域
        const specialties = [];
        const numSpecialties = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numSpecialties; i++) {
          const randomMajor = majorFields[Math.floor(Math.random() * majorFields.length)];
          if (!specialties.includes(randomMajor)) {
            specialties.push(randomMajor);
          }
        }
        
        // 生成隨機設施
        const facilities = [];
        const numFacilities = Math.floor(Math.random() * 5) + 5;
        for (let i = 0; i < numFacilities; i++) {
          const randomFacility = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
          if (!facilities.includes(randomFacility)) {
            facilities.push(randomFacility);
          }
        }
        
        // 創建大學對象
        const university = {
          name: univ.name,
          description: generateDescription(univ.name, countryName, univ.city, specialties),
          location: `${countryName} ${univ.city}`,
          country: countryName,
          city: univ.city,
          website: generateWebsite(univ.name, countryName),
          imageUrl: generateLogoUrl(univ.name, countryName),
          rating: univ.rating,
          majors: specialties.join(', '),
          facilities: facilities.join(', '),
          tuition: (10000 + Math.floor(Math.random() * 30000)) / 100 * 100
        };
        
        countryUniversities.push(university);
      }
    }
    
    // 繼續生成更多大學，直到達到目標數量 (至少30所)
    const targetNum = 35; // 多生成幾所，避免重複後不足30所
    
    while (countryUniversities.length < targetNum) {
      // 隨機選擇城市
      const city = countryCities[Math.floor(Math.random() * countryCities.length)];
      
      // 隨機選擇大學類型
      const type = universityTypes[Math.floor(Math.random() * universityTypes.length)];
      
      // 生成大學名稱 (可能的命名方式: 城市名+大學類型 或 國家名+序號+大學類型)
      let name;
      if (Math.random() > 0.5) {
        name = `${city}${type}`;
      } else {
        name = `${countryName}${countryUniversities.length + 1}${type}`;
      }
      
      // 檢查是否已存在同名大學
      if (countryUniversities.some(u => u.name === name)) {
        continue; // 已存在同名大學，重新生成
      }
      
      // 隨機選擇2-5個專業領域
      const specialties = [];
      const numSpecialties = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numSpecialties; i++) {
        const randomMajor = majorFields[Math.floor(Math.random() * majorFields.length)];
        if (!specialties.includes(randomMajor)) {
          specialties.push(randomMajor);
        }
      }
      
      // 生成隨機設施
      const facilities = [];
      const numFacilities = Math.floor(Math.random() * 5) + 5;
      for (let i = 0; i < numFacilities; i++) {
        const randomFacility = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
        if (!facilities.includes(randomFacility)) {
          facilities.push(randomFacility);
        }
      }
      
      // 生成評分 (3.0-5.0 之間)
      const rating = (3 + Math.random() * 2).toFixed(1);
      
      // 生成學費 (10000-40000 之間，取整到百位)
      const tuition = Math.round((10000 + Math.random() * 30000) / 100) * 100;
      
      // 創建大學對象
      const university = {
        name,
        description: generateDescription(name, countryName, city, specialties),
        location: `${countryName} ${city}`,
        country: countryName,
        city,
        website: generateWebsite(name, countryName),
        imageUrl: generateLogoUrl(name, countryName),
        rating: parseFloat(rating),
        majors: specialties.join(', '),
        facilities: facilities.join(', '),
        tuition
      };
      
      countryUniversities.push(university);
    }
    
    allUniversities.push(...countryUniversities);
    console.log(`完成生成 ${countryName} 的 ${countryUniversities.length} 所大學資料`);
  }
  
  // 將數據保存到 JSON 文件
  const dataDir = path.join(__dirname, '../data');
  
  // 如果目錄不存在，創建目錄
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const jsonFilePath = path.join(dataDir, 'universities.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(allUniversities, null, 2), 'utf8');
  
  console.log(`已將 ${allUniversities.length} 所大學的數據保存到 ${jsonFilePath}`);
  
  return allUniversities;
}

// 將大學數據保存到數據庫
async function saveUniversitiesToDatabase(universities) {
  console.log('開始將大學數據保存到數據庫...');
  
  try {
    // 批量插入資料以提高效率
    const batchSize = 50;
    for (let i = 0; i < universities.length; i += batchSize) {
      const batch = universities.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (university) => {
          try {
            // 檢查是否已存在同名大學
            const existing = await prisma.school.findFirst({
              where: { name: university.name }
            });
            
            if (!existing) {
              // 創建新記錄
              await prisma.school.create({
                data: {
                  name: university.name,
                  description: university.description,
                  location: university.location,
                  country: university.country,
                  city: university.city,
                  website: university.website,
                  imageUrl: university.imageUrl,
                  logo: university.imageUrl,
                  rating: university.rating,
                  majors: university.majors,
                  facilities: university.facilities,
                  tuition: university.tuition
                }
              });
            } else {
              // 更新現有記錄
              await prisma.school.update({
                where: { id: existing.id },
                data: {
                  description: university.description,
                  location: university.location,
                  country: university.country,
                  city: university.city,
                  website: university.website,
                  imageUrl: university.imageUrl,
                  logo: university.imageUrl,
                  rating: university.rating,
                  majors: university.majors,
                  facilities: university.facilities,
                  tuition: university.tuition
                }
              });
            }
          } catch (error) {
            console.error(`保存大學 "${university.name}" 時出錯:`, error);
          }
        })
      );
      
      console.log(`已處理 ${Math.min(i + batchSize, universities.length)}/${universities.length} 所大學`);
    }
    
    console.log('全部大學數據已成功保存到數據庫');
  } catch (error) {
    console.error('保存數據到數據庫時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 主函數
async function main() {
  try {
    // 生成大學資料
    const universities = await generateUniversities();
    
    // 計算每個國家的大學數量
    const countryCount = {};
    for (const uni of universities) {
      countryCount[uni.country] = (countryCount[uni.country] || 0) + 1;
    }
    
    console.log('每個國家的大學數量:');
    for (const country in countryCount) {
      console.log(`${country}: ${countryCount[country]} 所`);
    }
    
    // 確認所有國家都至少有30所大學
    let allCountriesHaveEnough = true;
    for (const country of countries) {
      const count = countryCount[country.name] || 0;
      if (count < 30) {
        allCountriesHaveEnough = false;
        console.log(`警告: ${country.name} 只有 ${count} 所大學，少於目標的 30 所`);
      }
    }
    
    if (allCountriesHaveEnough) {
      console.log('所有國家都達到了至少 30 所大學的目標');
    }
    
    // 保存到數據庫
    await saveUniversitiesToDatabase(universities);
    
  } catch (error) {
    console.error('執行腳本時出錯:', error);
  }
}

// 執行主函數
main()
  .then(() => console.log('大學數據生成和保存腳本執行完成'))
  .catch(error => console.error('大學數據生成和保存腳本執行失敗:', error)); 