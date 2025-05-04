import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 從 Authorization 標頭獲取令牌
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授權令牌' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // 驗證令牌
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: '無效或過期的令牌' },
        { status: 401 }
      );
    }
    
    // 從資料庫查詢用戶
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { profile: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '未找到用戶' },
        { status: 404 }
      );
    }
    
    // 移除敏感資訊後回傳
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('獲取用戶資訊錯誤:', error);
    return NextResponse.json(
      { error: '獲取用戶資訊失敗' },
      { status: 500 }
    );
  }
} 