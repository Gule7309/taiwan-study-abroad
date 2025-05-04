import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// 獲取所有用戶（管理員功能）
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('獲取用戶列表錯誤:', error);
    return NextResponse.json(
      { error: '獲取用戶列表失敗' },
      { status: 500 }
    );
  }
}

// 創建新用戶（管理員功能）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, role } = body;

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
        role: role || 'USER',
      },
    });

    // 隱藏密碼
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: '用戶創建成功', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('創建用戶錯誤:', error);
    return NextResponse.json(
      { error: '創建用戶失敗' },
      { status: 500 }
    );
  }
} 