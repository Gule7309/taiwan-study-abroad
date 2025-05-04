import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// 獲取用戶個人資料
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
    
    // 從資料庫查詢用戶和其個人資料
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
      profile: userWithoutPassword
    });
  } catch (error) {
    console.error('獲取用戶資料錯誤:', error);
    return NextResponse.json(
      { error: '獲取用戶資料失敗' },
      { status: 500 }
    );
  }
}

// 更新用戶個人資料
export async function PUT(request: Request) {
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
    
    // 解析請求體
    const body = await request.json();
    const { name, bio, avatar, phoneNumber } = body;
    
    // 更新用戶基本資訊
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name: name
      }
    });

    // 檢查用戶是否已有個人資料
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: decoded.id }
    });
    
    let updatedProfile;
    
    if (existingProfile) {
      // 更新現有個人資料
      updatedProfile = await prisma.profile.update({
        where: { userId: decoded.id },
        data: {
          bio,
          avatar,
          phoneNumber
        }
      });
    } else {
      // 創建新的個人資料
      updatedProfile = await prisma.profile.create({
        data: {
          userId: decoded.id,
          bio,
          avatar,
          phoneNumber
        }
      });
    }
    
    // 移除敏感資訊後回傳
    const { password, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json({
      message: '個人資料更新成功',
      user: userWithoutPassword,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('更新用戶資料錯誤:', error);
    return NextResponse.json(
      { error: '更新用戶資料失敗' },
      { status: 500 }
    );
  }
} 