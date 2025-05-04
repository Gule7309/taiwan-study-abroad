import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('開始建立初始資料...');

  // 清除所有現有數據
  await prisma.profile.deleteMany();
  await prisma.community.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  console.log('現有資料已清除');

  // 創建管理員用戶
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@studyab.com',
      name: '系統管理員',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          bio: '網站管理員',
          avatar: 'https://ui-avatars.com/api/?name=Admin',
        },
      },
    },
  });
  console.log('已創建管理員:', admin.email);

  // 創建普通用戶
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'user@studyab.com',
      name: '測試用戶',
      password: userPassword,
      role: 'USER',
      profile: {
        create: {
          bio: '我是一名有興趣留學的學生',
          avatar: 'https://ui-avatars.com/api/?name=User',
        },
      },
    },
  });
  console.log('已創建用戶:', user.email);

  // 創建一些學校
  const schools = await Promise.all([
    prisma.school.create({
      data: {
        name: '哈佛大學',
        description: '美國常春藤盟校之一，世界頂尖研究型大學',
        location: '美國 麻薩諸塞州 劍橋市',
        website: 'https://www.harvard.edu',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png',
        rating: 4.9,
      },
    }),
    prisma.school.create({
      data: {
        name: '牛津大學',
        description: '英國最古老的大學，世界頂級學府之一',
        location: '英國 牛津',
        website: 'https://www.ox.ac.uk',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg',
        rating: 4.8,
      },
    }),
    prisma.school.create({
      data: {
        name: '墨爾本大學',
        description: '澳洲最古老的大學之一，澳洲八大名校之一',
        location: '澳洲 維多利亞州 墨爾本',
        website: 'https://www.unimelb.edu.au',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/10/University_of_Melbourne_logo.svg',
        rating: 4.7,
      },
    }),
  ]);
  console.log(`已創建 ${schools.length} 所學校`);

  // 創建一些社區貼文
  const posts = await Promise.all([
    prisma.community.create({
      data: {
        title: '我的哈佛留學經驗分享',
        content: '我在哈佛大學的經驗非常豐富，課程雖然有挑戰性但非常有價值。校園生活充滿活力，有許多課外活動和俱樂部可以參加。',
        authorId: user.id,
        imageUrl: 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1',
      },
    }),
    prisma.community.create({
      data: {
        title: '申請牛津大學的建議',
        content: '申請牛津大學需要準備充分的個人陳述和推薦信，學術成績必須非常優秀。面試過程很重要，需要展示批判性思維和對所選學科的熱情。',
        authorId: admin.id,
        imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0',
      },
    }),
  ]);
  console.log(`已創建 ${posts.length} 篇貼文`);

  console.log('初始資料建立完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 