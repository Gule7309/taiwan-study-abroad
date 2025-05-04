'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaGraduationCap, FaGlobe, FaFlag, FaCamera, FaPen, FaSave, FaTimes, FaExclamationTriangle, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';

interface ProfileData {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phoneNumber: string;
  country: string;
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  interests: string[];
  targetCountries: string[];
  languages: string[];
  posts: number;
  comments: number;
  followers: number;
  following: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState<ProfileData>({
    id: '',
    username: '',
    name: '',
    email: '',
    avatar: '',
    bio: '',
    phoneNumber: '',
    country: '台灣',
    education: [
      { school: '', degree: '', year: '' }
    ],
    interests: [],
    targetCountries: [],
    languages: [],
    posts: 0,
    comments: 0,
    followers: 0,
    following: 0
  });
  
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTargetCountry, setNewTargetCountry] = useState('');

  // 處理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  // 獲取用戶資料
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true);
        
        // 檢查是否有令牌
        const token = localStorage.getItem('token');
        if (!token) {
          // 未登入，導向登入頁
          router.push('/login');
          return;
        }
        
        // 從API獲取用戶資料
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('獲取個人資料失敗');
        }
        
        const data = await response.json();
        const userData = data.profile;
        
        // 處理API返回的資料
        setUser({
          id: userData.id,
          username: userData.name || '',
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.profile?.avatar || '',
          bio: userData.profile?.bio || '',
          phoneNumber: userData.profile?.phoneNumber || '',
          country: '台灣', // 預設值
          education: [
            { school: '未設置', degree: '未設置', year: '未設置' }
          ],
          interests: [],
          targetCountries: [],
          languages: [],
          posts: 0,
          comments: 0,
          followers: 0,
          following: 0
        });
      } catch (err) {
        console.error('獲取用戶資料錯誤:', err);
        setError('無法載入用戶資料。請確保您已登入並重試。');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [router]);

  // 儲存用戶資料
  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      // 檢查是否有令牌
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('您需要登入才能更新資料');
      }
      
      // 發送更新請求
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          phoneNumber: user.phoneNumber
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '更新資料失敗');
      }
      
      // 更新成功
      setSuccessMessage('個人資料已成功更新');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() !== '' && !user.interests.includes(newInterest.trim())) {
      setUser({
        ...user,
        interests: [...user.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setUser({
      ...user,
      interests: user.interests.filter(i => i !== interest)
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() !== '' && !user.languages.includes(newLanguage.trim())) {
      setUser({
        ...user,
        languages: [...user.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setUser({
      ...user,
      languages: user.languages.filter(l => l !== language)
    });
  };

  const handleAddTargetCountry = () => {
    if (newTargetCountry.trim() !== '' && !user.targetCountries.includes(newTargetCountry.trim())) {
      setUser({
        ...user,
        targetCountries: [...user.targetCountries, newTargetCountry.trim()]
      });
      setNewTargetCountry('');
    }
  };

  const handleRemoveTargetCountry = (country: string) => {
    setUser({
      ...user,
      targetCountries: user.targetCountries.filter(c => c !== country)
    });
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
          <p className="text-xl text-gray-600">正在載入個人資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl font-bold mb-6">個人資料</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 資料頁頭部 */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 h-48">
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="relative mr-6">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400" size={64} />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
                  <FaCamera size={16} />
                </button>
              )}
            </div>
            
            {/* 文章、粉絲、關注計數區塊 */}
            <div className="flex space-x-6 bg-white p-3 rounded-t-lg mb-2 shadow-md">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{user.posts}</p>
                <p className="text-gray-700 font-medium">文章</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{user.followers}</p>
                <p className="text-gray-700 font-medium">粉絲</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{user.following}</p>
                <p className="text-gray-700 font-medium">關注</p>
              </div>
            </div>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-gray-100 transition-colors"
            >
              <FaPen className="mr-2" /> 編輯資料
            </button>
          ) : (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={() => setIsEditing(false)} 
                className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="mr-2" /> 取消
              </button>
              <button 
                onClick={handleSaveProfile} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center font-medium hover:bg-green-700 transition-colors"
              >
                <FaSave className="mr-2" /> 儲存
              </button>
            </div>
          )}
        </div>

        <div className="pt-20 pb-6 px-8">
          <div className="mb-6">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="text-2xl font-bold border-b-2 border-blue-500 mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-1">{user.name || '未設置姓名'}</h2>
              )}
              <div className="flex items-center text-gray-600 mb-2">
                <FaEnvelope className="mr-2" size={14} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaFlag className="mr-2" size={14} />
                {isEditing ? (
                  <input
                    type="text"
                    value={user.country}
                    onChange={(e) => setUser({...user, country: e.target.value})}
                    className="border-b border-gray-300"
                    placeholder="你的國家"
                  />
                ) : (
                  <span>{user.country}</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold mb-4">關於我</h3>
            {isEditing ? (
              <textarea
                value={user.bio}
                onChange={(e) => setUser({...user, bio: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
                placeholder="寫一些關於你自己的介紹..."
              />
            ) : (
              <p className="text-gray-700 mb-6">{user.bio || '用戶尚未添加個人介紹。'}</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold mb-4">聯絡方式</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 font-medium mb-2">電話號碼</p>
              {isEditing ? (
                <input
                  type="text"
                  value={user.phoneNumber || ''}
                  onChange={(e) => setUser({...user, phoneNumber: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="輸入你的電話號碼"
                />
              ) : (
                <p className="text-gray-700">{user.phoneNumber || '未設置'}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold mb-4">教育背景</h3>
            
            {user.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaGraduationCap className="text-gray-500 mr-2" size={16} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const newEducation = [...user.education];
                        newEducation[index].school = e.target.value;
                        setUser({...user, education: newEducation});
                      }}
                      className="flex-grow border-b border-gray-300"
                      placeholder="學校名稱"
                    />
                  ) : (
                    <p className="font-medium">{edu.school}</p>
                  )}
                </div>
                
                <div className="pl-6">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...user.education];
                          newEducation[index].degree = e.target.value;
                          setUser({...user, education: newEducation});
                        }}
                        className="w-full border-b border-gray-300"
                        placeholder="學位"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => {
                          const newEducation = [...user.education];
                          newEducation[index].year = e.target.value;
                          setUser({...user, education: newEducation});
                        }}
                        className="w-full border-b border-gray-300"
                        placeholder="年份 (例: 2018-2022)"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700">{edu.degree}</p>
                      <p className="text-gray-500 text-sm">{edu.year}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {isEditing && (
              <button
                onClick={() => setUser({
                  ...user,
                  education: [...user.education, { school: '', degree: '', year: '' }]
                })}
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                + 添加教育經歷
              </button>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold mb-4">留學意向國家</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {user.targetCountries.map((country, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
                  <FaGlobe className="mr-2" size={12} />
                  {country}
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveTargetCountry(country)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              
              {user.targetCountries.length === 0 && !isEditing && (
                <p className="text-gray-500">未設置留學意向國家</p>
              )}
            </div>
            
            {isEditing && (
              <div className="flex">
                <input
                  type="text"
                  value={newTargetCountry}
                  onChange={(e) => setNewTargetCountry(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  placeholder="添加意向國家"
                />
                <button
                  onClick={handleAddTargetCountry}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold mb-4">興趣領域</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {user.interests.map((interest, index) => (
                <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
                  {interest}
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              
              {user.interests.length === 0 && !isEditing && (
                <p className="text-gray-500">未設置興趣領域</p>
              )}
            </div>
            
            {isEditing && (
              <div className="flex">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  placeholder="添加興趣領域"
                />
                <button
                  onClick={handleAddInterest}
                  className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
                >
                  添加
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold mb-4">語言能力</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {user.languages.map((language, index) => (
                <div key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center">
                  {language}
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveLanguage(language)}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              
              {user.languages.length === 0 && !isEditing && (
                <p className="text-gray-500">未設置語言能力</p>
              )}
            </div>
            
            {isEditing && (
              <div className="flex">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  placeholder="添加語言能力 (例: 中文 (母語))"
                />
                <button
                  onClick={handleAddLanguage}
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
                >
                  添加
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 