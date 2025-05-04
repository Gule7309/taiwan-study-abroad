'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaGlobe, FaUniversity, FaSortAmountDown } from 'react-icons/fa';

// 大學類型定義
interface University {
  rank: string;
  name: string;
  country: string;
  score: number | null;
  detailLink: string | null;
}

// 大學詳情類型
interface UniversityDetail {
  name: string;
  description: string;
  location: string;
  website: string;
  scores: Record<string, number | null>;
  facilities: string[];
}

export default function RankingsPage() {
  // 狀態管理
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [rankingType, setRankingType] = useState<'world' | 'subject' | 'region'>('world');
  const [subject, setSubject] = useState('');
  const [region, setRegion] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // 可用國家列表
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  
  // 可用學科列表
  const subjectOptions = [
    '計算機科學', '工程學', '商業與管理', '醫學', '法律',
    '藝術與人文', '社會科學', '自然科學', '數學', '生命科學'
  ];
  
  // 可用地區列表
  const regionOptions = [
    'asia', 'europe', 'latin-america', 'us-canada', 'australia-new-zealand', 'brics'
  ];
  
  // 年份選項
  const yearOptions = [2025, 2024, 2023, 2022, 2021];
  
  // 在組件加載時獲取排名數據
  useEffect(() => {
    fetchRankings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, rankingType, subject, region]);
  
  // 獲取排名數據的函數
  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 構建查詢參數
      const params = new URLSearchParams();
      params.append('year', year.toString());
      params.append('type', rankingType);
      params.append('mock', 'true'); // 始終使用模擬數據，避免爬蟲問題
      
      if (rankingType === 'subject' && subject) {
        params.append('subject', subject);
      }
      
      if (rankingType === 'region' && region) {
        params.append('region', region);
      }
      
      // 發送請求
      const response = await fetch(`/api/universities/rankings?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('獲取排名數據失敗');
      }
      
      const data = await response.json();
      setUniversities(data.universities || []);
      
      // 提取所有可用的國家/地區
      if (data.universities && data.universities.length > 0) {
        const countries = extractCountries(data.universities);
        setAvailableCountries(countries);
      }
    } catch (err) {
      setError('獲取排名數據時出錯，請稍後再試');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 獲取大學詳情
  const fetchUniversityDetails = async (url: string) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('universityUrl', url);
      params.append('mock', 'true'); // 使用模擬數據
      
      const response = await fetch(`/api/universities/rankings?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('獲取大學詳情失敗');
      }
      
      const data = await response.json();
      setSelectedUniversity(data.university || null);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('獲取大學詳情失敗:', err);
      alert('獲取大學詳情失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };
  
  // 從排名數據中提取國家/地區
  const extractCountries = (universityList: University[]): string[] => {
    const countriesSet = new Set<string>();
    
    universityList.forEach(university => {
      if (university.country) {
        countriesSet.add(university.country);
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
  };
  
  const handleRankingTypeChange = (type: 'world' | 'subject' | 'region') => {
    setRankingType(type);
    // 如果切換為世界排名，清空學科和地區
    if (type === 'world') {
      setSubject('');
      setRegion('');
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 篩選大學列表
  const filteredUniversities = universities.filter(university => {
    // 篩選國家
    if (selectedCountries.length > 0 && !selectedCountries.includes(university.country)) {
      return false;
    }
    
    // 搜尋關鍵字
    if (searchTerm && !university.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container-custom py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">全球大學排名</h1>
        <p className="text-gray-600">
          查看來自 TopUniversities 的最新大學排名數據，幫助您選擇理想的留學目標。
        </p>
      </div>

      {/* 排名類型選擇和搜尋 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">排名類型</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleRankingTypeChange('world')}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg border ${
                  rankingType === 'world' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                }`}
              >
                <FaGlobe />
                <span>世界</span>
              </button>
              <button
                onClick={() => handleRankingTypeChange('subject')}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg border ${
                  rankingType === 'subject' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                }`}
              >
                <FaUniversity />
                <span>學科</span>
              </button>
              <button
                onClick={() => handleRankingTypeChange('region')}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 rounded-lg border ${
                  rankingType === 'region' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'
                }`}
              >
                <FaGlobe />
                <span>地區</span>
              </button>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">年份</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          {rankingType === 'subject' ? (
            <div>
              <label className="block mb-2 font-medium">學科</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選擇學科</option>
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ) : rankingType === 'region' ? (
            <div>
              <label className="block mb-2 font-medium">地區</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選擇地區</option>
                {regionOptions.map((r) => (
                  <option key={r} value={r}>
                    {r === 'asia' ? '亞洲' : 
                     r === 'europe' ? '歐洲' : 
                     r === 'latin-america' ? '拉丁美洲' : 
                     r === 'us-canada' ? '美國與加拿大' : 
                     r === 'australia-new-zealand' ? '澳洲與紐西蘭' : 
                     r === 'brics' ? 'BRICS國家' : r}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜尋大學名稱..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 篩選和結果區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 篩選側邊欄（移動裝置上可折疊） */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full p-3 bg-gray-100 rounded-lg flex items-center justify-between"
          >
            <span className="flex items-center">
              <FaFilter className="mr-2" /> 篩選選項
            </span>
            {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        
        {/* 篩選側邊欄內容 */}
        <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">篩選條件</h2>
            
            {/* 國家篩選 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">國家/地區</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
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
            
            <button 
              onClick={() => setSelectedCountries([])}
              className="w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              清除篩選
            </button>
          </div>
        </div>
        
        {/* 排名結果列表 */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">載入排名數據中...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchRankings}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重試
              </button>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">沒有找到符合條件的排名數據</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountries([]);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                清除所有篩選
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        排名
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        大學名稱
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        國家/地區
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        總分
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUniversities.map((university, index) => (
                      <tr 
                        key={index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {university.rank || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {university.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {university.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {university.score !== null ? university.score.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {university.detailLink && (
                            <button
                              onClick={() => fetchUniversityDetails(university.detailLink as string)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              詳情
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 大學詳情模態框 */}
      {isDetailModalOpen && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedUniversity.name}</h2>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">{selectedUniversity.location}</p>
                {selectedUniversity.website && (
                  <a 
                    href={selectedUniversity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    官方網站
                  </a>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">學校介紹</h3>
                <p className="text-gray-700">{selectedUniversity.description || '暫無介紹'}</p>
              </div>
              
              {selectedUniversity.scores && Object.keys(selectedUniversity.scores).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">評分項目</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedUniversity.scores).map(([category, score]) => (
                      <div key={category} className="border rounded-lg p-3">
                        <div className="text-sm text-gray-600">{category}</div>
                        <div className="font-bold text-lg">{score !== null ? score.toFixed(1) : '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedUniversity.facilities && selectedUniversity.facilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">學校設施與特色</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {selectedUniversity.facilities.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 