import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// 驗證請求體結構
const favoriteSchema = z.object({
  schoolId: z.string().min(1)
});

// DELETE 請求處理移除收藏
export async function DELETE(request: Request) {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    // 檢查用戶是否已登入
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: '需要登入才能移除收藏' },
        { status: 401 }
      );
    }
    
    // 解析URL參數
    const url = new URL(request.url);
    const schoolId = url.searchParams.get('schoolId');
    
    // 驗證請求參數
    if (!schoolId) {
      return NextResponse.json(
        { error: '學校ID為必填項' },
        { status: 400 }
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
    
    // 查找並刪除收藏記錄
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        schoolId: schoolId
      }
    });
    
    if (!favorite) {
      return NextResponse.json(
        { error: '該學校未被收藏' },
        { status: 404 }
      );
    }
    
    // 刪除收藏記錄
    await prisma.favorite.delete({
      where: { id: favorite.id }
    });
    
    return NextResponse.json(
      { message: '成功移除收藏' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('移除收藏時出錯:', error);
    
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: 500 }
    );
  }
} 