import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '缺少必要欄位' },
        { status: 400 }
      );
    }

    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用戶已存在' },
        { status: 409 }
      );
    }

    // 對密碼進行加密
    const hashedPassword = await bcrypt.hash(password, 12);

    // 創建新用戶
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 隱藏密碼
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: '註冊成功', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { error: '註冊失敗' },
      { status: 500 }
    );
  }
} 