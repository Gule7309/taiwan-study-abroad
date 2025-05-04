import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 批量更新用戶資料
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: '無效的用戶數據' },
        { status: 400 }
      );
    }

    // 使用事務處理批量更新
    const result = await prisma.$transaction(
      users.map(user => {
        if (!user.id) {
          throw new Error('所有用戶記錄必須包含ID');
        }
        
        // 確保不更新密碼
        const { password, ...updateData } = user;
        
        return prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      })
    );

    return NextResponse.json({
      message: '批量更新成功',
      updatedCount: result.length
    });
  } catch (error) {
    console.error('批量更新用戶錯誤:', error);
    return NextResponse.json(
      { error: '批量更新用戶失敗', message: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

// 批量刪除用戶
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    const userIds = ids.split(',');

    // 首先刪除相關的個人資料
    await prisma.profile.deleteMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });

    // 然後刪除用戶
    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    });

    return NextResponse.json({
      message: '批量刪除成功',
      deletedCount: result.count
    });
  } catch (error) {
    console.error('批量刪除用戶錯誤:', error);
    return NextResponse.json(
      { error: '批量刪除用戶失敗' },
      { status: 500 }
    );
  }
} 