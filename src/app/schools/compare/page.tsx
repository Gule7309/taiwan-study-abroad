'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaTimes, FaStar, FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaGraduationCap } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// 比較列表中學校的簡化類型
interface CompareSchool {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
}

// 完整學校資訊類型
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

export default function SchoolCompare() {
  const router = useRouter();
  const [compareSchools, setCompareSchools] = useState<CompareSchool[]>([]);
  const [schoolsData, setSchoolsData] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 從本地存儲加載比較列表
  useEffect(() => {
    try {
      // 在客戶端渲染時獲取localStorage數據
      const savedSchools = localStorage.getItem('compareSchools');
      if (savedSchools) {
        const parsedSchools = JSON.parse(savedSchools);
        setCompareSchools(parsedSchools);
        
        // 如果沒有學校，則提示用戶添加
        if (parsedSchools.length === 0) {
          setLoading(false);
          return;
        }
        
        // 獲取每所學校的詳細信息
        fetchSchoolsDetails(parsedSchools);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('讀取比較列表出錯:', err);
      setError('無法加載比較列表');
      setLoading(false);
    }
  }, []);
  
  // 獲取學校詳細資訊
  const fetchSchoolsDetails = async (schools: CompareSchool[]) => {
    try {
      setLoading(true);
      
      // 創建請求陣列
      const requests = schools.map(school => 
        fetch(`/api/schools/${school.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`獲取學校 ${school.id} 失敗`);
            }
            return response.json();
          })
          .then(data => data.school)
      );
      
      // 並行請求所有學校資料
      const schoolsDetails = await Promise.all(requests);
      setSchoolsData(schoolsDetails);
      setLoading(false);
    } catch (err) {
      console.error('獲取學校詳情出錯:', err);
      setError('獲取學校資料時出錯');
      setLoading(false);
    }
  };
  
  // 返回學校列表頁面
  const goBack = () => {
    router.push('/schools');
  };
  
  // 移除學校從比較列表
  const removeSchool = (schoolId: string) => {
    // 更新狀態
    const updatedCompareList = compareSchools.filter(school => school.id !== schoolId);
    setCompareSchools(updatedCompareList);
    
    // 更新學校詳情列表
    const updatedSchoolsData = schoolsData.filter(school => school.id !== schoolId);
    setSchoolsData(updatedSchoolsData);
    
    // 更新本地存儲
    localStorage.setItem('compareSchools', JSON.stringify(updatedCompareList));
    
    toast.success('已從比較列表中移除');
  };
  
  // 解析專業字符串為陣列
  const parseMajors = (majors?: string) => {
    if (!majors) return [];
    return majors.split(',').map(m => m.trim());
  };
  
  // 計算共同專業
  const getCommonMajors = () => {
    if (schoolsData.length <= 1) return [];
    
    // 獲取所有學校的專業列表
    const allMajorsLists = schoolsData.map(school => parseMajors(school.majors));
    
    // 從第一所學校開始，找出所有共同的專業
    let commonMajors = [...allMajorsLists[0]];
    
    for (let i = 1; i < allMajorsLists.length; i++) {
      commonMajors = commonMajors.filter(major => 
        allMajorsLists[i].includes(major)
      );
    }
    
    return commonMajors;
  };
  
  const commonMajors = getCommonMajors();
  
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
  
  if (compareSchools.length === 0) {
    return (
      <div className="container-custom py-12">
        <button 
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          返回學校列表
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FaUniversity className="mx-auto text-5xl text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">比較列表為空</h1>
          <p className="text-gray-600 mb-6">請從學校詳情頁面添加學校到比較列表</p>
          <button 
            onClick={goBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            瀏覽學校
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <button 
        onClick={goBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        返回學校列表
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">學校比較</h1>
      
      {/* 如果有共同專業，顯示提示 */}
      {commonMajors.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">共同專業</h2>
          <div className="flex flex-wrap gap-2">
            {commonMajors.map((major, index) => (
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
      
      {/* 比較表格 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left w-1/4 text-gray-700 font-semibold">比較項目</th>
              {schoolsData.map(school => (
                <th key={school.id} className="p-4 text-left">
                  <div className="relative pr-6">
                    <button 
                      onClick={() => removeSchool(school.id)}
                      className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                      aria-label="移除學校"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* 學校基本信息 */}
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700 bg-gray-50">學校</td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="w-16 h-16 mb-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {school.imageUrl ? (
                        <img 
                          src={school.imageUrl}
                          alt={school.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <FaUniversity className="text-2xl text-gray-400" />
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900">{school.name}</h3>
                      <button 
                        onClick={() => router.push(`/schools/${school.id}`)}
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        查看詳情
                      </button>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            
            {/* 位置 */}
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700 bg-gray-50 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                位置
              </td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  {school.location || "未提供"}
                </td>
              ))}
            </tr>
            
            {/* 評分 */}
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700 bg-gray-50 flex items-center">
                <FaStar className="mr-2 text-yellow-500" />
                評分
              </td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  <div className="flex items-center">
                    <span className="font-medium">{school.rating?.toFixed(1) || "無評分"}</span>
                    {school.rating && (
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-sm ${
                              i < Math.floor(school.rating) 
                                ? 'text-yellow-500' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            
            {/* 學費 */}
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700 bg-gray-50 flex items-center">
                <FaMoneyBillWave className="mr-2 text-gray-500" />
                學費 (年)
              </td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  {school.tuition ? (
                    <div>
                      <span className="font-medium">${school.tuition.toLocaleString()} USD</span>
                      <span className="block text-sm text-gray-500">約 NT$ {(school.tuition * 30).toLocaleString()}</span>
                    </div>
                  ) : (
                    "未提供"
                  )}
                </td>
              ))}
            </tr>
            
            {/* 專業 */}
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700 bg-gray-50 flex items-center">
                <FaGraduationCap className="mr-2 text-gray-500" />
                主要專業
              </td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  {school.majors ? (
                    <div className="flex flex-wrap gap-1">
                      {parseMajors(school.majors).map((major, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            commonMajors.includes(major)
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {major}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "未提供"
                  )}
                </td>
              ))}
            </tr>
            
            {/* 描述 */}
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700 bg-gray-50">描述</td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  <div className="max-h-40 overflow-y-auto pr-2">
                    {school.description || "未提供描述"}
                  </div>
                </td>
              ))}
            </tr>
            
            {/* 錄取條件 */}
            <tr>
              <td className="p-4 font-medium text-gray-700 bg-gray-50">錄取條件</td>
              {schoolsData.map(school => (
                <td key={school.id} className="p-4">
                  <div className="max-h-40 overflow-y-auto pr-2">
                    {school.admissions || "未提供錄取條件"}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 