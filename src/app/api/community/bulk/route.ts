import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 批量創建貼文
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { posts } = body;

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: '無效的貼文數據' },
        { status: 400 }
      );
    }

    // 使用事務處理批量創建
    const result = await prisma.$transaction(
      posts.map(post => {
        const { title, content, authorId } = post;
        
        if (!title || !content || !authorId) {
          throw new Error('所有貼文必須包含標題、內容和作者ID');
        }
        
        return prisma.community.create({
          data: post
        });
      })
    );

    return NextResponse.json({
      message: '批量創建成功',
      posts: result,
      createdCount: result.length
    }, { status: 201 });
  } catch (error) {
    console.error('批量創建貼文錯誤:', error);
    return NextResponse.json(
      { error: '批量創建貼文失敗', message: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

// 批量更新貼文
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { posts } = body;

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: '無效的貼文數據' },
        { status: 400 }
      );
    }

    // 使用事務處理批量更新
    const result = await prisma.$transaction(
      posts.map(post => {
        if (!post.id) {
          throw new Error('所有貼文必須包含ID');
        }
        
        return prisma.community.update({
          where: { id: post.id },
          data: post
        });
      })
    );

    return NextResponse.json({
      message: '批量更新成功',
      updatedCount: result.length
    });
  } catch (error) {
    console.error('批量更新貼文錯誤:', error);
    return NextResponse.json(
      { error: '批量更新貼文失敗', message: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

// 批量刪除貼文
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json(
        { error: '缺少貼文ID' },
        { status: 400 }
      );
    }

    const postIds = ids.split(',');

    // 刪除貼文
    const result = await prisma.community.deleteMany({
      where: {
        id: {
          in: postIds
        }
      }
    });

    return NextResponse.json({
      message: '批量刪除成功',
      deletedCount: result.count
    });
  } catch (error) {
    console.error('批量刪除貼文錯誤:', error);
    return NextResponse.json(
      { error: '批量刪除貼文失敗' },
      { status: 500 }
    );
  }
} 