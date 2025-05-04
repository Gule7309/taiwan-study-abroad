import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 獲取所有社區貼文
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const skip = (page - 1) * limit;

    // 獲取貼文總數
    const totalPosts = await prisma.community.count();
    
    // 獲取貼文列表
    const posts = await prisma.community.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      posts,
      pagination: {
        total: totalPosts,
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('獲取社區貼文錯誤:', error);
    return NextResponse.json(
      { error: '獲取社區貼文列表失敗' },
      { status: 500 }
    );
  }
}

// 創建社區貼文
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, authorId, imageUrl } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: '標題、內容和作者ID為必填項' },
        { status: 400 }
      );
    }

    // 檢查作者是否存在
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    });

    if (!author) {
      return NextResponse.json(
        { error: '找不到作者' },
        { status: 404 }
      );
    }

    const post = await prisma.community.create({
      data: {
        title,
        content,
        authorId,
        imageUrl
      }
    });

    return NextResponse.json(
      { message: '貼文創建成功', post },
      { status: 201 }
    );
  } catch (error) {
    console.error('創建貼文錯誤:', error);
    return NextResponse.json(
      { error: '創建貼文失敗' },
      { status: 500 }
    );
  }
} 