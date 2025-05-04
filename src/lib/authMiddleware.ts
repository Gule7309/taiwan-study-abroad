import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function authMiddleware(
  request: NextRequest,
  handler: (request: NextRequest, user: JwtPayload) => Promise<NextResponse>
) {
  try {
    // 從請求頭獲取認證信息
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // 驗證JWT令牌
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as JwtPayload;

    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用戶不存在' },
        { status: 401 }
      );
    }

    // 執行處理函數
    return handler(request, decoded);
  } catch (error) {
    console.error('認證錯誤:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: '無效的認證令牌' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: '認證失敗' },
      { status: 500 }
    );
  }
}

// 檢查用戶是否為管理員的中間件
export async function adminMiddleware(
  request: NextRequest,
  handler: (request: NextRequest, user: JwtPayload) => Promise<NextResponse>
) {
  return authMiddleware(request, async (req, user) => {
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '無權限訪問' },
        { status: 403 }
      );
    }
    
    return handler(req, user);
  });
} 