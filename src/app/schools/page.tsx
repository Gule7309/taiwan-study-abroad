'use client';

import { useState, useEffect, Suspense } from 'react';
import { FaFilter, FaSearch, FaSortAmountDown, FaUniversity, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// 學校類型定義
interface School {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  imageUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  country?: string;
}

export default function SchoolsPage() {
  // 狀態管理
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // 提取所有可能的國家
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [hasLoadedAllCountries, setHasLoadedAllCountries] = useState(false);
  
  // 在組件加載時獲取學校數據
  useEffect(() => {
    fetchSchools();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortOption, sortOrder, searchTerm, selectedCountries, ratingRange]);

  // 初始加載時獲取所有國家/地區
  useEffect(() => {
    if (!hasLoadedAllCountries) {
      fetchAllCountries();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoadedAllCountries]);

  // 從 API 獲取所有可能的國家/地區
  const fetchAllCountries = async () => {
    try {
      const response = await fetch('/api/schools?page=1&limit=100');
      
      if (!response.ok) {
        throw new Error('獲取國家數據失敗');
      }
      
      const data = await response.json();
      
      if (data.schools && data.schools.length > 0) {
        const countries = extractCountries(data.schools);
        setAvailableCountries(countries);
        setHasLoadedAllCountries(true);
      }
    } catch (err) {
      console.error('獲取國家列表失敗:', err);
    }
  };

  // 從 API 獲取學校數據
  const fetchSchools = async () => {
    try {
      setLoading(true);
      
      // 構建查詢參數
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (searchTerm) {
        params.append('name', searchTerm);
      }
      
      if (selectedCountries.length === 1) {
        params.append('country', selectedCountries[0]);
      }
      
      if (ratingRange.min) {
        params.append('minRating', ratingRange.min);
      }
      
      if (ratingRange.max) {
        params.append('maxRating', ratingRange.max);
      }
      
      params.append('sortBy', sortOption);
      params.append('sortOrder', sortOrder);
      
      const response = await fetch(`/api/schools?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('獲取學校數據失敗');
      }
      
      const data = await response.json();
      setSchools(data.schools || []);
      setTotalPages(data.pagination?.totalPages || 1);
      
    } catch (err) {
      setError('獲取學校數據時出錯，請稍後再試');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 從學校數據中提取國家/地區
  const extractCountries = (schoolsList: School[]): string[] => {
    const countriesSet = new Set<string>();
    
    schoolsList.forEach(school => {
      if (school.country) {
        countriesSet.add(school.country);
      } else if (school.location) {
        // 假設位置格式為 "國家/地區 省/州 城市"
        const parts = school.location.split(' ');
        if (parts.length > 0) {
          countriesSet.add(parts[0]);
        }
      }
    });
    
    return Array.from(countriesSet).sort();
  };
  
  // 處理篩選條件變更
  const handleCountryChange = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
    // 重置頁碼
    setPage(1);
  };
  
  const handleRatingMinChange = (value: string) => {
    setRatingRange({ ...ratingRange, min: value });
    // 重置頁碼
    setPage(1);
  };
  
  const handleRatingMaxChange = (value: string) => {
    setRatingRange({ ...ratingRange, max: value });
    // 重置頁碼
    setPage(1);
  };
  
  const handleSortChange = (option: string) => {
    if (sortOption === option) {
      // 如果點擊同一個排序選項，則切換排序順序
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      // 對於評分，默認是從高到低；對於名稱，默認是按字母順序
      setSortOrder(option === 'rating' ? 'desc' : 'asc');
    }
    // 重置頁碼
    setPage(1);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // 重置頁碼
    setPage(1);
  };
  
  const clearAllFilters = () => {
    setSelectedCountries([]);
    setRatingRange({ min: '', max: '' });
    setSearchTerm('');
    setSortOption('rating');
    setSortOrder('desc');
    setPage(1);
  };
  
  return (
    <div className="container-custom py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">學校搜尋</h1>
        <p className="text-gray-600">
          找到最適合你的大學和課程，使用我們的進階篩選功能縮小搜尋範圍。
        </p>
      </div>

      {/* 搜尋和篩選區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        {/* 篩選側邊欄 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">篩選條件</h2>
              <button 
                onClick={clearAllFilters}
                className="text-blue-600 text-sm hover:underline"
              >
                清除所有
              </button>
            </div>

            {/* 國家篩選 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">留學國家/地區</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableCountries.map((country) => (
                  <div key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`country-${country}`}
                      checked={selectedCountries.includes(country)}
                      onChange={() => handleCountryChange(country)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`country-${country}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {country}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 評分範圍篩選 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">學校評分</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rating-min" className="block text-sm text-gray-600 mb-1">
                    最低評分
                  </label>
                  <input
                    type="number"
                    id="rating-min"
                    min="1"
                    max="5"
                    step="0.1"
                    value={ratingRange.min}
                    onChange={(e) => handleRatingMinChange(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                    placeholder="最低"
                  />
                </div>
                <div>
                  <label htmlFor="rating-max" className="block text-sm text-gray-600 mb-1">
                    最高評分
                  </label>
                  <input
                    type="number"
                    id="rating-max"
                    min="1"
                    max="5"
                    step="0.1"
                    value={ratingRange.max}
                    onChange={(e) => handleRatingMaxChange(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                    placeholder="最高"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 搜尋結果區域 */}
        <div className="lg:col-span-3">
          {/* 搜尋和排序 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜尋學校名稱..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSortChange('name')}
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg border ${
                    sortOption === 'name' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                  }`}
                >
                  <span>名稱</span>
                  {sortOption === 'name' && (
                    <FaSortAmountDown className={`${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                  )}
                </button>
                <button 
                  onClick={() => handleSortChange('rating')}
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg border ${
                    sortOption === 'rating' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                  }`}
                >
                  <span>評分</span>
                  {sortOption === 'rating' && (
                    <FaSortAmountDown className={`${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 學校列表 */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">載入學校資料中...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchSchools}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重試
              </button>
            </div>
          ) : schools.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">沒有找到符合條件的學校</p>
              <button 
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                清除篩選條件
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {schools.map((school) => (
                  <div key={school.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            {school.imageUrl ? (
                              <img 
                                src={school.imageUrl} 
                                alt={school.name} 
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <FaUniversity className="text-4xl text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900">{school.name}</h3>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span className="font-medium">{school.rating?.toFixed(1) || "無評分"}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{school.location}</p>
                          <p className="mt-3 text-gray-700 line-clamp-2">
                            {school.description || "暫無介紹"}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              官方網站
                            </a>
                            <Link 
                              href={`/schools/${school.id}`}
                              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              學校詳情
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分頁控制 */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg ${
                        page === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      上一頁
                    </button>
                    <span className="text-gray-700">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        page === totalPages 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      下一頁
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 