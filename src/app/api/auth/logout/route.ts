import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 由於 JWT 是無狀態的，實際上沒有後端登出操作
    // 前端只需清除 token 即可
    // 但我們仍返回成功訊息讓前端知道請求成功
    
    return NextResponse.json({
      message: '登出成功'
    });
  } catch (error) {
    console.error('登出錯誤:', error);
    return NextResponse.json(
      { error: '登出失敗' },
      { status: 500 }
    );
  }
} 