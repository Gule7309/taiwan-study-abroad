'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type DataType = 'users' | 'schools' | 'posts';

interface StatCard {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  link: string;
}

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/debug/database');
        if (!response.ok) {
          throw new Error('獲取數據失敗');
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError('獲取數據時發生錯誤');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards: StatCard[] = [
    {
      title: '用戶',
      count: data?.counts?.users || 0,
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: '學校',
      count: data?.counts?.schools || 0,
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgColor: 'bg-green-500',
      link: '/admin/schools'
    },
    {
      title: '貼文',
      count: data?.counts?.posts || 0,
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      bgColor: 'bg-purple-500',
      link: '/admin/posts'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">管理後台</h1>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">管理後台</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">資料庫管理後台</h1>
      
      {/* 狀態卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link key={index} href={card.link} className="block">
            <div className={`${card.bgColor} text-white rounded-lg shadow-md p-6 transition-transform hover:scale-105`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-3xl font-bold mt-2">{card.count}</p>
                </div>
                <div className="text-white opacity-80">
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 text-sm text-white/80">
                點擊查看詳情和管理 →
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* 導航菜單 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">管理菜單</h2>
        <nav className="space-y-2">
          <Link href="/admin/users" className="block p-3 hover:bg-gray-100 rounded-lg transition">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              用戶管理
            </div>
          </Link>
          <Link href="/admin/schools" className="block p-3 hover:bg-gray-100 rounded-lg transition">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              學校管理
            </div>
          </Link>
          <Link href="/admin/posts" className="block p-3 hover:bg-gray-100 rounded-lg transition">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              貼文管理
            </div>
          </Link>
        </nav>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          返回首頁
        </Link>
      </div>
    </div>
  );
} 