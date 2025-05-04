import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 獲取所有學校
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const location = searchParams.get('location');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating') as string) : undefined;
    const maxRating = searchParams.get('maxRating') ? parseFloat(searchParams.get('maxRating') as string) : undefined;
    const minTuition = searchParams.get('minTuition') ? parseFloat(searchParams.get('minTuition') as string) : undefined;
    const maxTuition = searchParams.get('maxTuition') ? parseFloat(searchParams.get('maxTuition') as string) : undefined;
    const major = searchParams.get('major');
    const country = searchParams.get('country');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const where: any = {};
    
    if (name) {
      where.name = { contains: name };
    }
    
    if (location) {
      where.location = { contains: location };
    }
    
    if (country) {
      // 首先檢查 country 欄位
      where.OR = [
        { country: { equals: country } },
        // 然後檢查 location 欄位的開頭是否包含國家名稱
        { location: { startsWith: country } }
      ];
    }
    
    // 評分範圍篩選
    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      
      if (minRating !== undefined) {
        where.rating.gte = minRating;
      }
      
      if (maxRating !== undefined) {
        where.rating.lte = maxRating;
      }
    }
    
    // 學費範圍篩選
    if (minTuition !== undefined || maxTuition !== undefined) {
      where.tuition = {};
      
      if (minTuition !== undefined) {
        where.tuition.gte = minTuition;
      }
      
      if (maxTuition !== undefined) {
        where.tuition.lte = maxTuition;
      }
    }
    
    // 專業篩選
    if (major) {
      where.majors = { contains: major };
    }

    // 構建排序條件
    const orderBy: any = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder === 'desc' ? 'desc' : 'asc';
    } else if (sortBy === 'tuition') {
      orderBy.tuition = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.name = sortOrder === 'desc' ? 'desc' : 'asc';
    }

    // 獲取學校總數
    const totalSchools = await prisma.school.count({ where });
    
    // 獲取學校列表
    const schools = await prisma.school.findMany({
      where,
      take: limit,
      skip,
      orderBy
    });

    return NextResponse.json({
      schools,
      pagination: {
        total: totalSchools,
        page,
        limit,
        totalPages: Math.ceil(totalSchools / limit)
      }
    });
  } catch (error) {
    console.error('獲取學校錯誤:', error);
    return NextResponse.json(
      { error: '獲取學校列表失敗' },
      { status: 500 }
    );
  }
}

// 創建學校
export async function POST(request: Request) {
  try {
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

    if (!name) {
      return NextResponse.json(
        { error: '學校名稱為必填項' },
        { status: 400 }
      );
    }

    const school = await prisma.school.create({
      data: {
        name,
        description,
        location,
        website,
        imageUrl,
        rating: rating ? parseFloat(rating) : undefined,
        tuition: tuition ? parseFloat(tuition) : undefined,
        majors,
        admissions,
        facilities
      }
    });

    return NextResponse.json(
      { message: '學校創建成功', school },
      { status: 201 }
    );
  } catch (error) {
    console.error('創建學校錯誤:', error);
    return NextResponse.json(
      { error: '創建學校失敗' },
      { status: 500 }
    );
  }
} 