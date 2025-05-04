'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaSearch, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUserEdit, FaAngleDown } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 檢查用戶是否已登入的函數
  const checkLoginStatus = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUserName(user.name || '用戶');
          // 如果用戶有頭像，則設置頭像
          if (user.avatar) {
            setUserAvatar(user.avatar);
          }
        } catch (e) {
          console.error("解析用戶資訊錯誤:", e);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
  };

  // 在組件掛載和路徑變化時檢查登入狀態
  useEffect(() => {
    checkLoginStatus();
  }, [pathname]);

  // 添加自定義事件監聽器，用於在用戶登入後更新狀態
  useEffect(() => {
    // 定義一個函數處理用戶登入事件
    const handleUserLogin = () => {
      checkLoginStatus();
    };

    // 添加事件監聽器
    window.addEventListener('storage', (event) => {
      if (event.key === 'token' || event.key === 'user') {
        handleUserLogin();
      }
    });

    // 清理函數
    return () => {
      window.removeEventListener('storage', handleUserLogin);
    };
  }, []);

  // 處理點擊外部關閉下拉菜單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 處理登出
  const handleLogout = () => {
    // 清除本地存儲的用戶資訊和令牌
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 關閉下拉菜單
    setIsUserDropdownOpen(false);
    
    // 更新狀態
    setIsLoggedIn(false);
    setUserName('');
    setUserAvatar('');
    
    // 重導向到首頁
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom mx-auto py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/orgate-logo.svg"
              alt="Orgate Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-3xl font-bold text-blue-600">Orgate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium hover:text-blue-600 transition-colors">
              首頁
            </Link>
            <Link href="/schools" className="font-medium hover:text-blue-600 transition-colors">
              學校搜尋
            </Link>
            <Link href="/rankings" className="font-medium hover:text-blue-600 transition-colors">
              大學排名
            </Link>
            <Link href="/vr-tours" className="font-medium hover:text-blue-600 transition-colors">
              VR校園參觀
            </Link>
            <Link href="/community" className="font-medium hover:text-blue-600 transition-colors">
              留學社群
            </Link>
            <Link href="/about" className="font-medium hover:text-blue-600 transition-colors">
              關於我們
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="true"
                >
                  {userAvatar ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img 
                        src={userAvatar} 
                        alt={userName} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    <FaUserCircle className="text-blue-600 text-3xl" />
                  )}
                  <span className="font-medium text-base">{userName}</span>
                  <FaAngleDown className={`text-gray-500 transition-transform duration-200 ${isUserDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {/* 用戶下拉菜單 */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {userAvatar ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img 
                              src={userAvatar} 
                              alt={userName} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        ) : (
                          <FaUserCircle className="text-blue-600 text-4xl" />
                        )}
                        <div>
                          <p className="font-medium text-base">{userName}</p>
                          <p className="text-gray-500 text-sm truncate">用戶</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FaTachometerAlt className="mr-3 text-gray-500" size={16} /> 
                        <span>儀表板</span>
                      </Link>
                      <Link 
                        href="/dashboard/profile" 
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FaUserEdit className="mr-3 text-gray-500" size={16} /> 
                        <span>個人資料</span>
                      </Link>
                    </div>
                    <hr className="my-1 border-gray-200" />
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <FaSignOutAlt className="mr-3" size={16} /> 
                        <span>登出</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <FaSearch className="text-gray-600" />
                </button>
                <Link href="/login" className="btn-primary">
                  登入
                </Link>
                <Link href="/register" className="text-blue-600 hover:text-blue-800 transition-colors">
                  註冊
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-0 right-0 z-50">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                首頁
              </Link>
              <Link 
                href="/schools" 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                學校搜尋
              </Link>
              <Link 
                href="/rankings" 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                大學排名
              </Link>
              <Link 
                href="/vr-tours" 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                VR校園參觀
              </Link>
              <Link 
                href="/community" 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                留學社群
              </Link>
              <Link 
                href="/about" 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                關於我們
              </Link>
              
              {isLoggedIn ? (
                <>
                  {/* 用戶資訊 */}
                  <div className="p-3 bg-gray-50 rounded-md flex items-center space-x-3">
                    {userAvatar ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={userAvatar} 
                          alt={userName} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    ) : (
                      <FaUserCircle className="text-blue-600 text-4xl" />
                    )}
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-gray-500 text-sm">用戶</p>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaTachometerAlt className="mr-2" /> 儀表板
                  </Link>
                  <Link 
                    href="/dashboard/profile" 
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserEdit className="mr-2" /> 個人資料
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-center flex items-center justify-center"
                  >
                    <FaSignOutAlt className="mr-1" /> 登出
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    登入
                  </Link>
                  <Link 
                    href="/register" 
                    className="p-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    註冊
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 