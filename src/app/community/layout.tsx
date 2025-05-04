'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, FaComments, FaUsers, FaCalendarAlt, FaBell, 
  FaBookmark, FaSearch, FaEdit, FaInfoCircle 
} from 'react-icons/fa';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(5); // 模擬未讀通知
  
  // 導航項目
  const navItems = [
    { label: '討論區首頁', path: '/community', icon: <FaHome /> },
    { label: '發表主題', path: '/community/new', icon: <FaEdit /> },
    { label: '學長姐社群', path: '/community?tab=mentors', icon: <FaUsers /> },
    { label: '活動資訊', path: '/community?tab=events', icon: <FaCalendarAlt /> },
    { label: '通知', path: '/community/notifications', icon: <FaBell />, badge: notifications },
    { label: '我的收藏', path: '/community/bookmarks', icon: <FaBookmark /> },
    { label: '社群指南', path: '/community/guidelines', icon: <FaInfoCircle /> },
  ];
  
  // 檢查路徑是否活躍
  const isActive = (path: string) => {
    if (path === '/community') {
      return pathname === '/community';
    }
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      const queryParam = path.split('?')[1];
      return pathname === basePath && queryParam;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="container-custom py-12">
      {/* 社群導航欄 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
          <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-xl font-bold mr-6">留學社群</h1>
            <div className="relative flex-grow md:max-w-md">
              <input
                type="text"
                placeholder="搜尋討論、用戶或標籤..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {navItems.map((item) => (
              <Link 
                key={item.label}
                href={item.path}
                className={`whitespace-nowrap px-3 py-2 rounded-lg flex items-center ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    isActive(item.path)
                      ? 'bg-white text-blue-600' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 主要內容 */}
      {children}
      
      {/* 社群頁腳 */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="text-center text-gray-500 text-sm">
          <p>Orgate 留學社群提醒您：請遵守社群規範，共同維護良好的討論環境</p>
          <p className="mt-2">如有問題或建議，請 <Link href="/contact" className="text-blue-600 hover:underline">聯繫我們</Link></p>
          <p className="mt-1">© 2025 Orgate 保留所有權利</p>
        </div>
      </div>
    </div>
  );
} 