import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '當前密碼和新密碼都是必須的' },
        { status: 400 }
      );
    }

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: '找不到用戶' },
        { status: 404 }
      );
    }

    // 驗證當前密碼
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '當前密碼不正確' },
        { status: 401 }
      );
    }

    // 加密並更新新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 更新密碼
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      message: '密碼更新成功'
    });
  } catch (error) {
    console.error('更新密碼錯誤:', error);
    return NextResponse.json(
      { error: '更新密碼失敗' },
      { status: 500 }
    );
  }
} 