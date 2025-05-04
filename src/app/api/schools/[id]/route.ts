import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 獲取單個學校詳情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const school = await prisma.school.findUnique({
      where: { id }
    });

    if (!school) {
      return NextResponse.json(
        { error: '找不到該學校' },
        { status: 404 }
      );
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error('獲取學校詳情錯誤:', error);
    return NextResponse.json(
      { error: '獲取學校詳情失敗' },
      { status: 500 }
    );
  }
}

// 更新學校資料
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      name, 
      description, 
      location, 
      website, 
      imageUrl, 
      rating,
      tuition,
      majors,
      admissions,
      facilities
    } = body;

    // 檢查學校是否存在
    const existingSchool = await prisma.school.findUnique({
      where: { id }
    });

    if (!existingSchool) {
      return NextResponse.json(
        { error: '找不到該學校' },
        { status: 404 }
      );
    }

    // 更新學校資料
    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        location: location || undefined,
        website: website || undefined,
        imageUrl: imageUrl || undefined,
        rating: rating ? parseFloat(rating) : undefined,
        tuition: tuition ? parseFloat(tuition) : undefined,
        majors: majors || undefined,
        admissions: admissions || undefined,
        facilities: facilities || undefined
      }
    });

    return NextResponse.json({
      message: '學校更新成功',
      school: updatedSchool
    });
  } catch (error) {
    console.error('更新學校錯誤:', error);
    return NextResponse.json(
      { error: '更新學校失敗' },
      { status: 500 }
    );
  }
}

// 刪除學校
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 檢查學校是否存在
    const existingSchool = await prisma.school.findUnique({
      where: { id }
    });

    if (!existingSchool) {
      return NextResponse.json(
        { error: '找不到該學校' },
        { status: 404 }
      );
    }

    // 刪除學校
    await prisma.school.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: '學校刪除成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error('刪除學校錯誤:', error);
    return NextResponse.json(
      { error: '刪除學校失敗' },
      { status: 500 }
    );
  }
} 