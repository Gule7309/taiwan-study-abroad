'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaEnvelope, FaArrowRight, FaCheckCircle, FaGoogle, FaHome } from 'react-icons/fa';

// 導入 Google 登入相關庫
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

// 搜索參數組件
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  
  useEffect(() => {
    if (isRegistered) {
      // 使用全局事件來傳遞資訊
      window.dispatchEvent(new CustomEvent('registration-success'));
    }
  }, [isRegistered]);
  
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Google 用戶端 ID (需要從環境變數獲取)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // 監聽自定義事件來接收註冊成功消息
    const handleRegistrationSuccess = () => {
      setSuccess('註冊成功！請使用您的憑證登入。');
    };
    
    window.addEventListener('registration-success', handleRegistrationSuccess);
    
    return () => {
      window.removeEventListener('registration-success', handleRegistrationSuccess);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // 簡易表單驗證
    if (!formData.email || !formData.password) {
      setError('請填寫所有必填欄位');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登入失敗');
      }

      handleLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 修改登入成功後的處理邏輯
  const handleLoginSuccess = (token: string, user: any) => {
    // 儲存令牌至 localStorage
    localStorage.setItem('token', token);
    
    // 儲存簡單的用戶資訊
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.profile?.avatar || ''
    }));

    // 觸發 storage 事件以通知其他組件（如 Header）
    window.dispatchEvent(new Event('storage'));

    // 登入成功後導向儀表板
    router.push('/dashboard');
  };

  // 處理 Google 登入
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      setError('');
      
      // 獲取 Google 令牌
      const googleToken = credentialResponse.credential;
      if (!googleToken) {
        throw new Error('未能獲取 Google 認證');
      }

      // 解析 JWT 令牌獲取用戶資訊
      const tokenParts = googleToken.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // 構建個人資料對象
      const profileObj = {
        email: payload.email,
        name: payload.name || payload.given_name + ' ' + payload.family_name,
        imageUrl: payload.picture
      };

      // 發送到 API
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken,
          profileObj
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google 登入失敗');
      }

      handleLoginSuccess(data.token, data.user);
    } catch (err: any) {
      console.error('Google 登入錯誤:', err);
      setError(err.message || 'Google 登入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google 登入失敗');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* 包裝 SearchParams 在 Suspense 中 */}
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-gray-900">登入帳號</h2>
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <FaHome className="mr-1" /> 返回首頁
            </Link>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            還沒有帳號？
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
              註冊
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center">
              <FaCheckCircle className="mr-2" />
              {success}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">電子郵件</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="電子郵件"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">密碼</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="密碼"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                記住我
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                忘記密碼？
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                  <FaArrowRight className="h-5 w-5 text-white" />
                </span>
              )}
              登入
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或使用以下方式登入</span>
            </div>
          </div>

          <div className="mt-6">
            {googleClientId ? (
              <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="100%"
                  text="signin_with"
                  locale="zh_TW"
                />
              </GoogleOAuthProvider>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                disabled
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
                使用 Google 帳號登入 (未設置)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 