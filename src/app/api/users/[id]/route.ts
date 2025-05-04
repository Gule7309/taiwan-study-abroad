import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: '找不到用戶' },
        { status: 404 }
      );
    }

    // 隱藏密碼
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('獲取用戶錯誤:', error);
    return NextResponse.json(
      { error: '獲取用戶信息失敗' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { name, email, role, bio, phoneNumber, avatar } = body;

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: '找不到用戶' },
        { status: 404 }
      );
    }

    // 更新用戶資料
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : user.name,
        email: email !== undefined ? email : user.email,
        role: role !== undefined ? role : user.role,
        profile: {
          upsert: {
            create: {
              bio: bio || undefined,
              phoneNumber: phoneNumber || undefined,
              avatar: avatar || undefined,
            },
            update: {
              bio: bio !== undefined ? bio : user.profile?.bio,
              phoneNumber: phoneNumber !== undefined ? phoneNumber : user.profile?.phoneNumber,
              avatar: avatar !== undefined ? avatar : user.profile?.avatar,
            },
          },
        },
      },
      include: { profile: true },
    });

    // 隱藏密碼
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: '用戶資料更新成功',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('更新用戶錯誤:', error);
    return NextResponse.json(
      { error: '更新用戶資料失敗' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: '找不到用戶' },
        { status: 404 }
      );
    }

    // 先刪除用戶的個人資料
    if (user) {
      await prisma.profile.deleteMany({
        where: { userId: userId }
      });
    }

    // 刪除用戶
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      message: '用戶刪除成功'
    });
  } catch (error) {
    console.error('刪除用戶錯誤:', error);
    return NextResponse.json(
      { error: '刪除用戶失敗' },
      { status: 500 }
    );
  }
} 