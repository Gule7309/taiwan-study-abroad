import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 獲取大學列表
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 獲取查詢參數
    const country = searchParams.get('country');
    const name = searchParams.get('name');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 100;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0;
    
    // 讀取大學數據
    const dataPath = path.join(process.cwd(), 'data', 'universities.json');
    
    // 檢查文件是否存在
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { 
          error: '大學數據尚未就緒，請先執行爬蟲腳本', 
          message: '請執行 "node scripts/scrapeUniversities.js" 來獲取最新數據' 
        }, 
        { status: 404 }
      );
    }
    
    // 讀取JSON文件
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    let universities = JSON.parse(fileContent);
    
    // 根據國家篩選
    if (country) {
      universities = universities.filter(uni => 
        uni.country && uni.country.toLowerCase().includes(country.toLowerCase())
      );
    }
    
    // 根據名稱搜索
    if (name) {
      universities = universities.filter(uni => 
        uni.name && uni.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // 計算總數
    const total = universities.length;
    
    // 分頁
    universities = universities.slice(offset, offset + limit);
    
    return NextResponse.json({
      universities,
      meta: {
        total,
        limit,
        offset,
        count: universities.length
      }
    });
  } catch (error) {
    console.error('獲取大學數據時出錯:', error);
    return NextResponse.json(
      { error: error.message || '獲取大學數據失敗' },
      { status: 500 }
    );
  }
} 