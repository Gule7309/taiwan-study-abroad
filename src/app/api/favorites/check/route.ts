import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 檢查學校是否已經收藏
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授權，請先登入' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    
    if (!schoolId) {
      return NextResponse.json(
        { error: '缺少學校ID' },
        { status: 400 }
      );
    }
    
    // 查詢收藏記錄
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        schoolId
      }
    });
    
    return NextResponse.json({
      isFavorite: !!favorite,
      favoriteId: favorite ? favorite.id : null
    });
  } catch (error) {
    console.error('檢查收藏狀態錯誤:', error);
    return NextResponse.json(
      { error: '檢查收藏狀態失敗' },
      { status: 500 }
    );
  }
} 