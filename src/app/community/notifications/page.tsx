'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaComment, FaHeart, FaUserPlus, FaReply, FaBookmark, FaEllipsisH, FaCheck, FaBell, FaFilter } from 'react-icons/fa';

// 模擬通知數據
const notificationsData = [
  {
    id: 1,
    type: 'comment',
    content: '留學新手 評論了你的文章 "托福準備心得與資源分享"',
    date: '1小時前',
    read: false,
    link: '/community/1',
    user: '留學新手',
    userLink: '/profile/user1'
  },
  {
    id: 2,
    type: 'like',
    content: '英倫愛麗絲 喜歡了你的文章 "美國大學申請時間規劃分享"',
    date: '3小時前',
    read: false,
    link: '/community/2',
    user: '英倫愛麗絲',
    userLink: '/profile/user2'
  },
  {
    id: 3,
    type: 'follow',
    content: '東京櫻花 開始關注你',
    date: '昨天',
    read: false,
    link: '',
    user: '東京櫻花',
    userLink: '/profile/user3'
  },
  {
    id: 4,
    type: 'reply',
    content: '留學老手阿明 回覆了你在 "在倫敦的生活費預算詳解" 的評論',
    date: '昨天',
    read: true,
    link: '/community/3',
    user: '留學老手阿明',
    userLink: '/profile/user4'
  },
  {
    id: 5,
    type: 'bookmark',
    content: '文書高手 收藏了你的文章 "如何準備成功的碩士申請文書？"',
    date: '2天前',
    read: true,
    link: '/community/4',
    user: '文書高手',
    userLink: '/profile/user5'
  },
  {
    id: 6,
    type: 'reply',
    content: '澳洲袋鼠 回覆了你在 "澳洲打工度假簽證申請全攻略" 的評論',
    date: '3天前',
    read: true,
    link: '/community/5',
    user: '澳洲袋鼠',
    userLink: '/profile/user6'
  },
  {
    id: 7,
    type: 'like',
    content: '未來的CS人 喜歡了你的評論',
    date: '5天前',
    read: true,
    link: '/community/1',
    user: '未來的CS人',
    userLink: '/profile/user7'
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('all');
  
  // 篩選通知
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
      ? notifications.filter(notif => !notif.read)
      : notifications.filter(notif => notif.type === filter);
  
  // 標記為已讀
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };
  
  // 標記所有為已讀
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({...notif, read: true})));
  };
  
  // 獲取未讀通知數量
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // 獲取通知圖標
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'follow':
        return <FaUserPlus className="text-green-500" />;
      case 'reply':
        return <FaReply className="text-purple-500" />;
      case 'bookmark':
        return <FaBookmark className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">通知</h1>
          <div className="flex items-center space-x-4">
            <div className="relative inline-block">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">所有通知</option>
                <option value="unread">未讀 ({unreadCount})</option>
                <option value="comment">評論</option>
                <option value="like">讚好</option>
                <option value="follow">關注</option>
                <option value="reply">回覆</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaCheck className="mr-1" /> 全部標為已讀
              </button>
            )}
          </div>
        </div>
        
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`border-b border-gray-100 pb-4 ${!notification.read ? 'bg-blue-50 -mx-4 px-4 py-3 rounded-lg' : ''}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800">
                        <Link href={notification.userLink} className="font-medium hover:text-blue-600 transition-colors">
                          {notification.user}
                        </Link>
                        <span className="mx-1">
                          {notification.content.substring(notification.content.indexOf(' ') + 1)}
                        </span>
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">{notification.date}</span>
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="標記為已讀"
                          >
                            <FaCheck size={12} />
                          </button>
                        )}
                        <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <FaEllipsisH size={12} />
                        </button>
                      </div>
                    </div>
                    {notification.link && (
                      <div className="mt-1">
                        <Link 
                          href={notification.link}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          查看詳情
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FaBell className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500">沒有{filter !== 'all' ? '符合條件的' : ''}通知</p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">通知設置</h2>
        <p className="text-gray-600 mb-4">自定義通知類型和接收方式，管理社群互動體驗。</p>
        <div className="mt-4">
          <Link 
            href="/dashboard/settings/notifications"
            className="btn-secondary"
          >
            管理通知設置
          </Link>
        </div>
      </div>
    </>
  );
} 