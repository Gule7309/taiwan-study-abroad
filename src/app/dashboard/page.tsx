'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaEdit, FaHeart, FaBookmark, FaComments, FaBell, FaPencilAlt, FaCalendarAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('用戶');
  const [isLoading, setIsLoading] = useState(true);

  // 獲取用戶資訊
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!token) {
        // 未登入，導向登入頁
        router.push('/login');
        return;
      }
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || '用戶');
        } catch (e) {
          console.error('解析用戶資訊錯誤', e);
        }
      }
      setIsLoading(false);
    }
  }, [router]);

  // 處理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  // 模擬用戶數據
  const userData = {
    username: userName,
    avatar: '',
    posts: 5,
    comments: 12,
    followers: 8,
    following: 15,
    notifications: 3,
    bookmarks: 7,
    recentActivities: [
      { id: 1, type: 'post', title: '發表了文章 "托福準備心得與資源分享"', date: '2025/03/15' },
      { id: 2, type: 'comment', title: '評論了文章 "美國大學申請時間規劃分享"', date: '2025/03/12' },
      { id: 3, type: 'bookmark', title: '收藏了文章 "2026年美國Top30大學申請截止日期整理"', date: '2025/03/10' }
    ],
    upcomingEvents: [
      { id: 1, title: '美國大學線上招生說明會', date: '2025/04/25 14:00-16:00' },
      { id: 2, title: '英國碩士申請文書工作坊', date: '2025/05/02 19:00-21:00' }
    ]
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl text-gray-600">正在載入儀表板...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl font-bold mb-8">個人儀表板</h1>

      {/* 用戶概覽 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center">
          <div className="mr-6">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-gray-400" size={48} />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">你好，{userData.username}！</h2>
              <Link 
                href="/dashboard/profile" 
                className="text-blue-600 flex items-center hover:text-blue-800 transition-colors"
              >
                <FaEdit className="mr-1" size={14} /> 編輯個人資料
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xl font-bold">{userData.posts}</p>
                <p className="text-gray-500 text-sm">發表文章</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{userData.comments}</p>
                <p className="text-gray-500 text-sm">發表評論</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{userData.followers}</p>
                <p className="text-gray-500 text-sm">粉絲</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{userData.following}</p>
                <p className="text-gray-500 text-sm">關注</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 快速功能 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Link 
          href="/community/new" 
          className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPencilAlt className="mr-3" size={24} />
          <div>
            <h3 className="font-bold">發布文章</h3>
            <p className="text-sm opacity-80">分享你的留學經驗</p>
          </div>
        </Link>
        <Link 
          href="/dashboard/notifications" 
          className="bg-yellow-500 text-white rounded-lg p-6 hover:bg-yellow-600 transition-colors flex items-center"
        >
          <FaBell className="mr-3" size={24} />
          <div>
            <h3 className="font-bold">通知 <span className="bg-white text-yellow-500 px-2 rounded-full text-xs">{userData.notifications}</span></h3>
            <p className="text-sm opacity-80">查看最新互動消息</p>
          </div>
        </Link>
        <Link 
          href="/dashboard/bookmarks" 
          className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition-colors flex items-center"
        >
          <FaBookmark className="mr-3" size={24} />
          <div>
            <h3 className="font-bold">我的收藏 <span className="bg-white text-purple-600 px-2 rounded-full text-xs">{userData.bookmarks}</span></h3>
            <p className="text-sm opacity-80">管理你的收藏文章</p>
          </div>
        </Link>
        <Link 
          href="/community/events" 
          className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition-colors flex items-center"
        >
          <FaCalendarAlt className="mr-3" size={24} />
          <div>
            <h3 className="font-bold">活動日曆</h3>
            <p className="text-sm opacity-80">查看即將舉行的活動</p>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="bg-red-600 text-white rounded-lg p-6 hover:bg-red-700 transition-colors flex items-center"
        >
          <FaSignOutAlt className="mr-3" size={24} />
          <div>
            <h3 className="font-bold">登出</h3>
            <p className="text-sm opacity-80">退出您的帳號</p>
          </div>
        </button>
      </div>
      
      {/* 內容區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 最近活動 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">最近活動</h2>
            <div className="space-y-4">
              {userData.recentActivities.map((activity) => (
                <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {activity.type === 'post' && <FaFileAlt className="text-blue-500" />}
                      {activity.type === 'comment' && <FaComments className="text-green-500" />}
                      {activity.type === 'bookmark' && <FaBookmark className="text-purple-500" />}
                    </div>
                    <div>
                      <p className="text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                href="/dashboard/activities" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                查看全部活動
              </Link>
            </div>
          </div>
        </div>
        
        {/* 即將舉行的活動 */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">即將舉行的活動</h2>
            <div className="space-y-4">
              {userData.upcomingEvents.map((event) => (
                <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-blue-800">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FaCalendarAlt className="mr-2" size={12} />
                    <span>{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link 
                href="/community/events" 
                className="block text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                瀏覽更多活動
              </Link>
            </div>
          </div>
          
          {/* 我的關注 */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">我的關注</h2>
              <Link 
                href="/dashboard/following" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                查看全部
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                    <FaUserCircle className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">留學顧問張小明</p>
                    <p className="text-xs text-gray-500">美國留學專家</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FaHeart className="text-red-500" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                    <FaUserCircle className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">文書專家李教授</p>
                    <p className="text-xs text-gray-500">留學文書指導</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FaHeart className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 