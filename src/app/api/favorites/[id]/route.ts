import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 刪除收藏
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授權，請先登入' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { id } = params;
    
    // 檢查收藏是否存在並且屬於該用戶
    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!favorite) {
      return NextResponse.json(
        { error: '找不到該收藏或您無權操作' },
        { status: 404 }
      );
    }
    
    // 刪除收藏
    await prisma.favorite.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: '已從收藏中移除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('刪除收藏錯誤:', error);
    return NextResponse.json(
      { error: '刪除收藏失敗' },
      { status: 500 }
    );
  }
} 