import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 獲取用戶收藏的學校列表
export async function GET() {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    // 檢查用戶是否已登入
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: '需要登入才能查看收藏' },
        { status: 401 }
      );
    }
    
    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '找不到用戶資料' },
        { status: 404 }
      );
    }
    
    // 獲取用戶收藏的學校列表，包含學校詳細資料
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        school: true
      }
    });
    
    // 組織返回數據，僅包含必要的學校資訊
    const favoriteSchools = favorites.map(favorite => ({
      id: favorite.school.id,
      name: favorite.school.name,
      logo: favorite.school.logo,
      country: favorite.school.country,
      city: favorite.school.city,
      favoriteId: favorite.id,
      createdAt: favorite.createdAt
    }));
    
    return NextResponse.json(
      { favorites: favoriteSchools },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('獲取收藏列表時出錯:', error);
    
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: 500 }
    );
  }
}

// 添加學校到收藏
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授權，請先登入' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { schoolId } = await request.json();
    
    if (!schoolId) {
      return NextResponse.json(
        { error: '缺少學校ID' },
        { status: 400 }
      );
    }
    
    // 檢查學校是否存在
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });
    
    if (!school) {
      return NextResponse.json(
        { error: '找不到該學校' },
        { status: 404 }
      );
    }
    
    // 檢查是否已經收藏
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        schoolId
      }
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: '該學校已在收藏中' },
        { status: 400 }
      );
    }
    
    // 添加收藏
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        schoolId
      },
      include: {
        school: true
      }
    });
    
    return NextResponse.json(
      { 
        message: '學校已添加到收藏', 
        favorite: {
          id: favorite.id,
          schoolId: favorite.schoolId,
          createdAt: favorite.createdAt,
          school: favorite.school
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('添加收藏錯誤:', error);
    return NextResponse.json(
      { error: '添加收藏失敗' },
      { status: 500 }
    );
  }
} 