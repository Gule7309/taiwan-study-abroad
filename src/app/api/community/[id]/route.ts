import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 獲取單個社區貼文詳情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: '缺少貼文ID' },
        { status: 400 }
      );
    }

    const post = await prisma.community.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: '找不到貼文' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('獲取貼文詳情錯誤:', error);
    return NextResponse.json(
      { error: '獲取貼文詳情失敗' },
      { status: 500 }
    );
  }
}

// 更新社區貼文
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();
    const { title, content, imageUrl } = body;

    if (!postId) {
      return NextResponse.json(
        { error: '缺少貼文ID' },
        { status: 400 }
      );
    }

    const post = await prisma.community.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: '找不到貼文' },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.community.update({
      where: { id: postId },
      data: {
        title: title || post.title,
        content: content || post.content,
        imageUrl: imageUrl !== undefined ? imageUrl : post.imageUrl
      }
    });

    return NextResponse.json({
      message: '貼文更新成功',
      post: updatedPost
    });
  } catch (error) {
    console.error('更新貼文錯誤:', error);
    return NextResponse.json(
      { error: '更新貼文失敗' },
      { status: 500 }
    );
  }
}

// 刪除社區貼文
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: '缺少貼文ID' },
        { status: 400 }
      );
    }

    const post = await prisma.community.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: '找不到貼文' },
        { status: 404 }
      );
    }

    await prisma.community.delete({
      where: { id: postId }
    });

    return NextResponse.json({
      message: '貼文刪除成功'
    });
  } catch (error) {
    console.error('刪除貼文錯誤:', error);
    return NextResponse.json(
      { error: '刪除貼文失敗' },
      { status: 500 }
    );
  }
} 