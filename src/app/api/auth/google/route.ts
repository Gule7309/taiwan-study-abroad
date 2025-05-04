import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// 處理 Google 登入
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { googleToken, profileObj } = body;
    
    if (!googleToken || !profileObj) {
      return NextResponse.json(
        { error: '缺少必要的 Google 登入資訊' },
        { status: 400 }
      );
    }
    
    const { email, name, imageUrl } = profileObj;
    
    // 檢查用戶是否已存在
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // 創建新用戶
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          name,
          password: '', // Google 登入不需要密碼
          role: 'USER',
          profile: {
            create: {
              avatar: imageUrl,
              bio: ''
            }
          }
        },
        include: {
          profile: true
        }
      });
    } else {
      // 如果用戶存在，但沒有個人資料，則創建一個
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
      });
      
      if (!profile) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            avatar: imageUrl,
            bio: ''
          }
        });
      }
    }
    
    // 生成 JWT 令牌
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    // 移除敏感資訊
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Google 登入成功',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Google 登入錯誤:', error);
    return NextResponse.json(
      { error: 'Google 登入失敗' },
      { status: 500 }
    );
  }
} 