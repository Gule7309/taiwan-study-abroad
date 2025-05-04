'use client';

import { useState } from 'react';
import { FaVrCardboard, FaGlobe, FaInfoCircle, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

const vrTours = [
  {
    id: 1,
    name: '哈佛大學',
    country: '美國',
    thumbnail: '/harvard.jpg',
    description: '參觀美國頂尖大學的歷史建築和校園設施。',
    features: ['圖書館', '學生中心', '宿舍', '運動場'],
  },
  {
    id: 2,
    name: '牛津大學',
    country: '英國',
    thumbnail: '/oxford.jpg',
    description: '探索英國牛津大學的古老校園和學院。',
    features: ['古老學院', '圖書館', '食堂', '花園'],
  },
  {
    id: 3,
    name: '東京大學',
    country: '日本',
    thumbnail: '/tokyo.jpg',
    description: '遊覽日本頂尖學府的現代化設施。',
    features: ['研究實驗室', '圖書館', '學生活動中心', '櫻花大道'],
  },
  {
    id: 4,
    name: '墨爾本大學',
    country: '澳洲',
    thumbnail: '/melbourne.jpg',
    description: '體驗澳洲著名學府的開放式校園。',
    features: ['藝術中心', '運動場', '學生公寓', '研究中心'],
  },
  {
    id: 5,
    name: '多倫多大學',
    country: '加拿大',
    thumbnail: '/toronto.jpg',
    description: '領略加拿大名校的多元文化氛圍。',
    features: ['科學樓', '主廣場', '學生中心', '歷史建築'],
  },
  {
    id: 6,
    name: '國立台灣大學',
    country: '台灣',
    thumbnail: '/ntu.jpg',
    description: '參觀台灣頂尖學府的校園環境。',
    features: ['椰林大道', '圖書館', '博物館', '體育館'],
  },
];

export default function VrToursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  
  const filteredTours = vrTours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === '' || tour.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="container-custom py-12">
      {/* 頁面標題 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">VR 校園參觀</h1>
        <p className="text-gray-600 max-w-3xl">
          透過沉浸式的虛擬實境技術，在出發前就能身臨其境地體驗世界各地大學的校園環境。
          使用VR眼鏡或直接在瀏覽器中瀏覽360°全景。
        </p>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋大學名稱..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          <div>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">所有國家</option>
              <option value="美國">美國</option>
              <option value="英國">英國</option>
              <option value="澳洲">澳洲</option>
              <option value="加拿大">加拿大</option>
              <option value="日本">日本</option>
              <option value="台灣">台灣</option>
            </select>
          </div>
        </div>
      </div>

      {/* VR 體驗資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
        <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-semibold mb-1">如何使用虛擬校園導覽</h3>
          <p className="text-sm text-gray-700">
            1. 直接使用瀏覽器查看360°全景圖<br />
            2. 使用VR眼鏡（如Oculus Quest或Google Cardboard）獲得完整沉浸式體驗<br />
            3. 配合耳機使用可體驗校園環境音效
          </p>
        </div>
      </div>

      {/* VR 校園列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            {/* 縮略圖 */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaVrCardboard size={60} className="text-gray-400" />
              </div>
              <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-md">
                {tour.country}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">點擊開始虛擬參觀</p>
              </div>
            </div>
            
            {/* 學校資訊 */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{tour.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{tour.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">包含景點：</h4>
                <div className="flex flex-wrap gap-2">
                  {tour.features.map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link href={`/vr-tours/${tour.id}`} className="btn-primary flex-1 text-center flex items-center justify-center">
                  <FaVrCardboard className="mr-2" /> 開始VR參觀
                </Link>
                <Link href={`/schools?name=${tour.name}`} className="btn-secondary flex-1 text-center flex items-center justify-center">
                  <FaGlobe className="mr-2" /> 學校資訊
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 提示訊息 */}
      {filteredTours.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaSearch size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">未找到符合條件的VR校園導覽</h3>
          <p className="text-gray-600">
            請嘗試調整搜尋條件或選擇不同的國家
          </p>
        </div>
      )}

      {/* VR 體驗資訊 */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">為何選擇虛擬校園參觀？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">節省時間與費用</h3>
            <p className="text-sm text-gray-600">
              無需花費大量金錢和時間親自前往各國參觀校園，就能獲得身臨其境的體驗。
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">做出更明智的選擇</h3>
            <p className="text-sm text-gray-600">
              透過虛擬參觀，更全面地了解學校環境和設施，幫助你做出更適合的留學決定。
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">提前適應環境</h3>
            <p className="text-sm text-gray-600">
              熟悉校園布局和周邊環境，讓你抵達目的地後能更快適應新的學習環境。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 