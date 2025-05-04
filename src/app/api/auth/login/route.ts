import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '請提供電子郵件和密碼' },
        { status: 400 }
      );
    }

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: '無效的憑證' },
        { status: 401 }
      );
    }

    // 檢查密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '無效的憑證' },
        { status: 401 }
      );
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 隱藏密碼
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: '登入成功',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    return NextResponse.json(
      { error: '登入失敗' },
      { status: 500 }
    );
  }
} 