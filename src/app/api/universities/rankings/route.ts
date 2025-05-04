import { NextResponse } from 'next/server';
import { scrapeTopUniversities, scrapeUniversityDetails } from '@/lib/scrapers/topUniversities';

// 獲取大學排名數據
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 獲取查詢參數
    const year = searchParams.get('year') ? parseInt(searchParams.get('year') as string) : undefined;
    const type = searchParams.get('type') as 'world' | 'subject' | 'region' | undefined;
    const subject = searchParams.get('subject') || undefined;
    const region = searchParams.get('region') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100;
    const universityUrl = searchParams.get('universityUrl') || undefined;
    const useMockData = searchParams.get('mock') === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    
    // 如果提供了具體大學的URL，則爬取該大學的詳細信息
    if (universityUrl) {
      const universityDetails = await scrapeUniversityDetails(universityUrl, useMockData);
      return NextResponse.json({ university: universityDetails });
    }
    
    // 否則爬取排名數據
    const universities = await scrapeTopUniversities({
      year,
      type,
      subject,
      region,
      limit,
      useMockData
    });
    
    return NextResponse.json({
      universities,
      meta: {
        count: universities.length,
        year,
        type,
        subject,
        region,
        isMockData: useMockData || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
      }
    });
  } catch (error) {
    console.error('API 請求處理失敗:', error);
    return NextResponse.json(
      { error: error.message || '獲取大學排名數據失敗' },
      { status: 500 }
    );
  }
} 