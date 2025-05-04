import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// 驗證請求體結構
const favoriteSchema = z.object({
  schoolId: z.string().min(1)
});

// POST 請求處理添加收藏
export async function POST(request: Request) {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    // 檢查用戶是否已登入
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: '需要登入才能添加收藏' },
        { status: 401 }
      );
    }
    
    // 解析請求體
    const body = await request.json();
    
    // 驗證請求體
    const validationResult = favoriteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '無效的請求數據', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { schoolId } = validationResult.data;
    
    // 確認學校存在
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });
    
    if (!school) {
      return NextResponse.json(
        { error: '找不到指定學校' },
        { status: 404 }
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
    
    // 檢查是否已經收藏
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        schoolId: school.id
      }
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { message: '已經收藏過該學校' },
        { status: 200 }
      );
    }
    
    // 創建收藏記錄
    const favorite = await prisma.favorite.create({
      data: {
        user: { connect: { id: user.id } },
        school: { connect: { id: school.id } }
      }
    });
    
    return NextResponse.json(
      { 
        message: '成功添加到收藏',
        favorite 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('添加收藏時出錯:', error);
    
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: 500 }
    );
  }
} 