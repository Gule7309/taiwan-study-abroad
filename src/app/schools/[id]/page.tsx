'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar, FaUniversity, FaGlobe, FaMapMarkerAlt, FaHeart, FaRegHeart, FaMoneyBillWave, FaGraduationCap, FaClipboardCheck, FaBuilding, FaExchangeAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

// 學校類型定義
interface School {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  imageUrl: string;
  rating: number;
  tuition: number;
  majors: string;
  admissions: string;
  facilities: string;
  createdAt: string;
  updatedAt: string;
}

export default function SchoolDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const schoolId = params.id as string;
  
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);
  
  useEffect(() => {
    if (!schoolId) return;
    
    const fetchSchoolDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/schools/${schoolId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('找不到該學校');
          }
          throw new Error('獲取學校詳情失敗');
        }
        
        const data = await response.json();
        setSchool(data.school);
      } catch (err) {
        console.error(err);
        setError(err.message || '加載學校資料時出錯');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchoolDetails();
  }, [schoolId]);
  
  // 檢查學校是否已收藏
  useEffect(() => {
    if (status !== 'authenticated' || !schoolId) return;
    
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/check?schoolId=${schoolId}`);
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
          setFavoriteId(data.favoriteId);
        }
      } catch (err) {
        console.error('檢查收藏狀態出錯:', err);
      }
    };
    
    checkFavoriteStatus();
  }, [schoolId, status]);
  
  const goBack = () => {
    router.back();
  };
  
  // 切換收藏狀態
  const toggleFavorite = async () => {
    if (status !== 'authenticated') {
      toast.error('請先登入以使用收藏功能');
      return;
    }
    
    try {
      if (isFavorite && favoriteId) {
        // 取消收藏
        const response = await fetch(`/api/favorites/${favoriteId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsFavorite(false);
          setFavoriteId(null);
          toast.success('已從收藏中移除');
        } else {
          const error = await response.json();
          throw new Error(error.error || '移除收藏失敗');
        }
      } else {
        // 添加收藏
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schoolId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(true);
          setFavoriteId(data.favorite.id);
          toast.success('已添加到收藏');
        } else {
          const error = await response.json();
          throw new Error(error.error || '添加收藏失敗');
        }
      }
    } catch (err) {
      console.error('操作收藏出錯:', err);
      toast.error(err.message || '操作失敗，請稍後再試');
    }
  };
  
  // 添加到比較
  const addToCompare = () => {
    if (!school) return;
    
    // 從本地存儲獲取當前比較的學校
    const compareList = JSON.parse(localStorage.getItem('compareSchools') || '[]');
    
    // 檢查是否已經在比較列表中
    const isAlreadyInList = compareList.some((s) => s.id === school.id);
    
    if (isAlreadyInList) {
      toast.error('該學校已在比較列表中');
      return;
    }
    
    // 限制比較列表最多3所學校
    if (compareList.length >= 3) {
      toast.error('比較列表最多只能添加3所學校');
      return;
    }
    
    // 添加到比較列表
    const updatedList = [...compareList, {
      id: school.id,
      name: school.name,
      imageUrl: school.imageUrl,
      location: school.location
    }];
    
    // 保存到本地存儲
    localStorage.setItem('compareSchools', JSON.stringify(updatedList));
    
    setIsAddingToCompare(true);
    
    // 顯示成功訊息
    toast.success('已添加到比較列表');
    
    // 延遲跳轉到比較頁面
    setTimeout(() => {
      router.push('/schools/compare');
    }, 1000);
  };
  
  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">載入學校資料中...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
            <button 
              onClick={goBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              返回學校列表
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!school) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
              <p>找不到該學校的資料</p>
            </div>
            <button 
              onClick={goBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              返回學校列表
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 解析出主要專業列表
  const majorsList = school.majors ? school.majors.split(',').map(m => m.trim()) : [];
  
  return (
    <div className="container-custom py-12">
      {/* 返回按鈕 */}
      <button 
        onClick={goBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        返回學校列表
      </button>
      
      {/* 學校詳情卡片 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 學校標誌 */}
            <div className="md:w-1/4 flex-shrink-0">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-48 md:h-64 flex items-center justify-center">
                {school.imageUrl ? (
                  <img 
                    src={school.imageUrl} 
                    alt={school.name} 
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <FaUniversity className="text-5xl text-gray-400" />
                )}
              </div>
              
              {/* 操作按鈕 */}
              <div className="mt-4 flex flex-col gap-3">
                {school.website && (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FaGlobe className="mr-2" />
                    訪問官方網站
                  </a>
                )}
                <button 
                  onClick={toggleFavorite}
                  className={`w-full px-4 py-2 ${isFavorite ? 'bg-red-100 text-red-600 border border-red-300' : 'border border-gray-300 text-gray-700'} font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center`}
                >
                  {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                  {isFavorite ? '已收藏' : '加入收藏'}
                </button>
                <button 
                  onClick={addToCompare}
                  disabled={isAddingToCompare}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <FaExchangeAlt className="mr-2" />
                  添加到比較
                </button>
                <Link
                  href="/community"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  查看相關討論
                </Link>
              </div>
            </div>
            
            {/* 學校資訊 */}
            <div className="flex-grow">
              {/* 基本信息 */}
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{school.rating?.toFixed(1) || "無評分"}</span>
                </div>
              </div>
              
              {/* 位置與學費信息 */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{school.location || "位置未提供"}</span>
                </div>
                
                {school.tuition && (
                  <div className="flex items-start">
                    <FaMoneyBillWave className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">年均學費: ${school.tuition.toLocaleString()} USD</span>
                      <span className="block text-sm text-gray-500">約 NT$ {(school.tuition * 30).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 主要資訊卡片 */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {/* 學校介紹 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">學校介紹</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {school.description || "暫無學校介紹資料"}
                  </p>
                </div>
                
                {/* 主要專業 */}
                {majorsList.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      <FaGraduationCap className="mr-2 text-gray-600" />
                      主要專業
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {majorsList.map((major, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 錄取條件 */}
                {school.admissions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      <FaClipboardCheck className="mr-2 text-gray-600" />
                      錄取條件
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {school.admissions}
                    </p>
                  </div>
                )}
                
                {/* 校園設施 */}
                {school.facilities && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      <FaBuilding className="mr-2 text-gray-600" />
                      校園設施
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {school.facilities}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 