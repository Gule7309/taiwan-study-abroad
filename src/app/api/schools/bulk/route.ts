import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 批量創建學校
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schools } = body;

    if (!schools || !Array.isArray(schools) || schools.length === 0) {
      return NextResponse.json(
        { error: '無效的學校數據' },
        { status: 400 }
      );
    }

    // 使用事務處理批量創建
    const result = await prisma.$transaction(
      schools.map(school => {
        const { name } = school;
        
        if (!name) {
          throw new Error('所有學校記錄必須包含名稱');
        }
        
        return prisma.school.create({
          data: {
            ...school,
            rating: school.rating ? parseFloat(school.rating.toString()) : undefined
          }
        });
      })
    );

    return NextResponse.json({
      message: '批量創建成功',
      schools: result,
      createdCount: result.length
    }, { status: 201 });
  } catch (error) {
    console.error('批量創建學校錯誤:', error);
    return NextResponse.json(
      { error: '批量創建學校失敗', message: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

// 批量更新學校
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { schools } = body;

    if (!schools || !Array.isArray(schools) || schools.length === 0) {
      return NextResponse.json(
        { error: '無效的學校數據' },
        { status: 400 }
      );
    }

    // 使用事務處理批量更新
    const result = await prisma.$transaction(
      schools.map(school => {
        if (!school.id) {
          throw new Error('所有學校記錄必須包含ID');
        }
        
        return prisma.school.update({
          where: { id: school.id },
          data: {
            ...school,
            rating: school.rating ? parseFloat(school.rating.toString()) : undefined
          }
        });
      })
    );

    return NextResponse.json({
      message: '批量更新成功',
      updatedCount: result.length
    });
  } catch (error) {
    console.error('批量更新學校錯誤:', error);
    return NextResponse.json(
      { error: '批量更新學校失敗', message: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

// 批量刪除學校
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json(
        { error: '缺少學校ID' },
        { status: 400 }
      );
    }

    const schoolIds = ids.split(',');

    // 刪除學校
    const result = await prisma.school.deleteMany({
      where: {
        id: {
          in: schoolIds
        }
      }
    });

    return NextResponse.json({
      message: '批量刪除成功',
      deletedCount: result.count
    });
  } catch (error) {
    console.error('批量刪除學校錯誤:', error);
    return NextResponse.json(
      { error: '批量刪除學校失敗' },
      { status: 500 }
    );
  }
} 