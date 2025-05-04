import Link from 'next/link';
import Image from 'next/image';
import { FaUniversity, FaSearch, FaGlobe, FaUsers, FaVrCardboard } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              規劃你的留學之旅
            </h1>
            <p className="text-xl mb-8">
              一站式台灣學生專屬留學資訊平台，幫助你找到最適合的留學選擇。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schools" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                探索學校
              </Link>
              <Link href="/vr-tours" className="btn-secondary">
                VR校園參觀
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80">
              <div className="absolute inset-0 bg-white rounded-lg opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaGlobe size={120} className="text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 -mt-16 relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center">快速學校搜尋</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="country" className="block mb-2 text-sm font-medium">
                  留學國家
                </label>
                <select
                  id="country"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選擇國家</option>
                  <option value="usa">美國</option>
                  <option value="uk">英國</option>
                  <option value="australia">澳洲</option>
                  <option value="canada">加拿大</option>
                  <option value="japan">日本</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="program" className="block mb-2 text-sm font-medium">
                  學位類型
                </label>
                <select
                  id="program"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選擇學位</option>
                  <option value="bachelor">學士</option>
                  <option value="master">碩士</option>
                  <option value="phd">博士</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="field" className="block mb-2 text-sm font-medium">
                  學科領域
                </label>
                <select
                  id="field"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選擇領域</option>
                  <option value="business">商業管理</option>
                  <option value="engineering">工程</option>
                  <option value="cs">電腦科學</option>
                  <option value="arts">人文藝術</option>
                  <option value="science">自然科學</option>
                </select>
              </div>
              <div className="self-end">
                <button className="btn-primary h-[3.75rem] flex items-center justify-center w-full">
                  <FaSearch className="mr-2" /> 搜尋
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">為什麼選擇我們的平台？</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUniversity className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">台灣專屬資訊</h3>
              <p className="text-gray-600">
                專為台灣學生打造的留學資訊，包含簽證申請、獎學金和文化適應指南。
              </p>
            </div>
            
            <div className="card text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaVrCardboard className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">VR校園參觀</h3>
              <p className="text-gray-600">
                身臨其境體驗世界各地的大學校園，讓你在出發前就了解未來的學習環境。
              </p>
            </div>
            
            <div className="card text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">留學社群支援</h3>
              <p className="text-gray-600">
                連結已在海外的台灣學長姐，獲取第一手的經驗分享和建議。
              </p>
            </div>
            
            <div className="card text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">個性化推薦</h3>
              <p className="text-gray-600">
                根據你的學術背景、興趣和預算，推薦最適合你的學校和課程。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">熱門留學目的地</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            探索台灣學生最喜愛的留學國家，了解各國教育體系、生活費用及申請要點。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative rounded-lg overflow-hidden group h-64 shadow-md">
              <div className="absolute inset-0 bg-blue-800 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">美國</h3>
                <p className="text-center mb-4 opacity-90">頂尖大學、多元文化、廣闊就業機會</p>
                <Link href="/schools?country=usa" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                  了解更多
                </Link>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden group h-64 shadow-md">
              <div className="absolute inset-0 bg-blue-800 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">英國</h3>
                <p className="text-center mb-4 opacity-90">悠久歷史、優質教育、一年制碩士課程</p>
                <Link href="/schools?country=uk" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                  了解更多
                </Link>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden group h-64 shadow-md">
              <div className="absolute inset-0 bg-blue-800 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">澳洲</h3>
                <p className="text-center mb-4 opacity-90">優質生活、友善環境、畢業工作簽證</p>
                <Link href="/schools?country=australia" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                  了解更多
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/schools" className="btn-secondary">
              查看所有留學國家
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">留學生心得分享</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">陳小明</h4>
                  <p className="text-sm text-gray-600">美國 UCLA 資訊工程系</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                「這個平台提供的申請指南幫助我順利進入UCLA，VR校園導覽讓我在來之前就對校園有所了解，非常實用！」
              </p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">林雨婷</h4>
                  <p className="text-sm text-gray-600">英國倫敦政經學院 經濟系</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                「平台上的學長姐經驗分享對我幫助很大，透過社群功能我還在出發前就認識了幾位同校的台灣同學！」
              </p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">王大偉</h4>
                  <p className="text-sm text-gray-600">澳洲墨爾本大學 商學院</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                「個性化推薦功能為我找到了最適合的學校和課程，平台上的獎學金資訊也幫我節省了不少學費！」
              </p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Navigation */}
      <section className="py-8 bg-gray-100">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-6">管理員區域</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin" className="card p-6 bg-white hover:bg-blue-50 transition-colors text-center flex flex-col items-center justify-center gap-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <FaUsers className="text-blue-600" />
              </div>
              <h3 className="font-bold">管理員頁面</h3>
              <p className="text-sm text-gray-600">管理使用者帳號和系統設定</p>
            </Link>
            
            <Link href="/schools/manage" className="card p-6 bg-white hover:bg-blue-50 transition-colors text-center flex flex-col items-center justify-center gap-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <FaUniversity className="text-blue-600" />
              </div>
              <h3 className="font-bold">學校管理</h3>
              <p className="text-sm text-gray-600">新增、編輯和刪除學校資訊</p>
            </Link>
            
            <Link href="/posts/manage" className="card p-6 bg-white hover:bg-blue-50 transition-colors text-center flex flex-col items-center justify-center gap-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <FaGlobe className="text-blue-600" />
              </div>
              <h3 className="font-bold">社區貼文管理</h3>
              <p className="text-sm text-gray-600">審核和管理社區貼文內容</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">準備好開始你的留學之旅了嗎？</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            立即註冊帳號，獲取個性化留學推薦，開始規劃你的國際教育之路。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              免費註冊
            </Link>
            <Link href="/about" className="btn-secondary border border-white bg-transparent hover:bg-blue-700">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">管理後台</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            管理學校和社區的平台，讓你更方便地管理資料和與他人交流。
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link 
              href="/admin" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              前往管理後台
            </Link>
            
            <Link 
              href="/schools" 
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              瀏覽學校
            </Link>
            
            <Link 
              href="/community" 
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              查看社區貼文
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
