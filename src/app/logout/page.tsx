'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  
  useEffect(() => {
    async function logout() {
      try {
        // 呼叫登出 API
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // 清除本地儲存
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 導向首頁
        router.push('/');
      } catch (error) {
        console.error('登出錯誤:', error);
        // 即使出錯也要清除本地儲存並導向首頁
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
      }
    }
    
    logout();
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">正在登出...</h2>
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 