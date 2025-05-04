import { NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

// 注意：此端點僅用於開發環境，生產環境中應該禁用
export async function GET(request: Request) {
  // 檢查環境，只允許在開發環境中使用
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: '此端點在生產環境中不可用' },
      { status: 403 }
    );
  }

  // 先測試資料庫連接，並返回錯誤信息
  try {
    console.log('正在測試資料庫連接...');
    const connectionStatus = await testDatabaseConnection();
    console.log('資料庫連接測試結果:', connectionStatus);
    
    if (!connectionStatus.connected) {
      console.error('資料庫連接失敗:', connectionStatus);
      return NextResponse.json(
        { 
          error: '資料庫連接失敗', 
          details: connectionStatus,
          databaseUrl: process.env.DATABASE_URL ? '已配置' : '未配置',
          environment: process.env.NODE_ENV
        },
        { status: 500 }
      );
    }

    // 資料庫連接成功，嘗試獲取數據
    try {
      // 獲取所有用戶（不包含密碼）
      console.log('正在獲取用戶數據...');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        }
      });
      console.log(`獲取到 ${users.length} 個用戶`);

      // 獲取所有學校
      console.log('正在獲取學校數據...');
      const schools = await prisma.school.findMany();
      console.log(`獲取到 ${schools.length} 所學校`);

      // 獲取所有社區貼文
      console.log('正在獲取社區貼文數據...');
      const posts = await prisma.community.findMany();
      console.log(`獲取到 ${posts.length} 篇貼文`);

      return NextResponse.json({
        connectionStatus,
        users,
        schools,
        posts,
        counts: {
          users: users.length,
          schools: schools.length,
          posts: posts.length
        },
        databaseUrl: process.env.DATABASE_URL ? '已配置' : '未配置',
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error('獲取資料庫數據錯誤:', error);
      return NextResponse.json(
        { 
          error: '獲取資料庫數據失敗', 
          message: error instanceof Error ? error.message : String(error),
          databaseUrl: process.env.DATABASE_URL ? '已配置' : '未配置',
          environment: process.env.NODE_ENV
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('資料庫測試發生未預期的錯誤:', error);
    return NextResponse.json(
      { 
        error: '資料庫測試過程中發生未預期的錯誤', 
        message: error instanceof Error ? error.message : String(error),
        databaseUrl: process.env.DATABASE_URL ? '已配置' : '未配置',
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    );
  }
} 