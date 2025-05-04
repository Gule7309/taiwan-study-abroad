import Link from 'next/link';
import { FaUniversity, FaUsers, FaChartLine, FaLightbulb, FaHandshake } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      {/* 頁面標題 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">關於我們</h1>
        <p className="text-gray-600 max-w-3xl">
          台灣留學資訊平台致力於為台灣學生提供全面、個性化的留學資訊服務，
          幫助每一位有留學夢想的學子找到最適合自己的國際教育機會。
        </p>
      </div>

      {/* 我們的理念 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">我們的理念</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">資訊透明</h3>
              <p className="text-gray-600">
                提供客觀、全面的留學資訊，不受任何商業機構影響，
                讓學生和家長基於真實數據做出明智的留學決定。
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">學生優先</h3>
              <p className="text-gray-600">
                以台灣學生的需求為核心，提供量身定制的指導和資源，
                幫助他們克服留學過程中的各種挑戰。
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">創新服務</h3>
              <p className="text-gray-600">
                運用最新技術如VR、AI等提升留學資訊服務體驗，
                不斷探索更有效的方式幫助學生規劃留學之路。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 我們的故事 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">我們的故事</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 mb-4">
              台灣留學資訊平台源於三位台灣留學生的共同願景。2023年，分別在美國、英國和澳洲留學的陳小明、林雨婷和王大偉發現，台灣學生在尋找留學資訊時常常需要在多個平台間跳轉，且很難找到針對台灣學生特定需求的內容。
            </p>
            <p className="text-gray-700 mb-4">
              他們決定創建一個集合所有留學資訊的一站式平台，專門為台灣學生服務。平台上線後，迅速獲得了廣大學生和家長的認可，也吸引了眾多在海外的台灣留學生加入，分享自己的經驗和建議。
            </p>
            <p className="text-gray-700">
              我們相信，每一位台灣學生都應該有機會獲得優質的國際教育。透過提供客觀、全面、台灣特定的留學資訊和服務，我們希望能夠降低留學的門檻，幫助更多台灣學子實現留學夢想。
            </p>
          </div>
        </div>
      </section>

      {/* 我們的團隊 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">我們的團隊</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">陳小明</h3>
              <p className="text-gray-600 mb-3">共同創辦人 & 執行長</p>
              <p className="text-gray-700 mb-4">
                哈佛大學商學院MBA畢業，曾就職於Google和麥肯錫。負責平台整體發展策略和業務拓展。
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">林雨婷</h3>
              <p className="text-gray-600 mb-3">共同創辦人 & 產品總監</p>
              <p className="text-gray-700 mb-4">
                倫敦政經學院教育科技碩士，前英國文化協會項目經理。負責平台產品設計和內容策略。
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">王大偉</h3>
              <p className="text-gray-600 mb-3">共同創辦人 & 技術總監</p>
              <p className="text-gray-700 mb-4">
                墨爾本大學電腦科學博士，曾在微軟擔任資深工程師。負責平台的技術架構和創新功能開發。
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">張小芬</h3>
              <p className="text-gray-600 mb-3">內容主管</p>
              <p className="text-gray-700 mb-4">
                台大新聞研究所畢業，前留學雜誌主編。負責平台的內容品質和編輯團隊管理。
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">黃建國</h3>
              <p className="text-gray-600 mb-3">社群經理</p>
              <p className="text-gray-700 mb-4">
                政大傳播學系畢業，擁有豐富的社群媒體管理經驗。負責平台的社群建設和用戶參與。
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">李小華</h3>
              <p className="text-gray-600 mb-3">留學顧問主管</p>
              <p className="text-gray-700 mb-4">
                史丹佛大學教育學碩士，擁有十年留學顧問經驗。負責平台的留學諮詢服務和顧問團隊。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 合作夥伴 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">合作夥伴</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-center text-gray-700 mb-8">
            我們與國內外多所知名機構和組織合作，共同為台灣學生提供更優質的留學服務。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <FaUniversity className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <FaUniversity className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <FaUniversity className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <FaUniversity className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <FaUniversity className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <FaUniversity className="text-gray-400 text-4xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 聯絡我們 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">聯絡我們</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">業務合作</h3>
              <p className="text-gray-700 mb-2">
                如果您是教育機構、留學服務提供商或其他相關組織，希望與我們合作，請聯繫：
              </p>
              <p className="text-blue-600">partner@taiwan-studyabroad.tw</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">媒體垂詢</h3>
              <p className="text-gray-700 mb-2">
                媒體採訪或相關合作請聯繫：
              </p>
              <p className="text-blue-600">media@taiwan-studyabroad.tw</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3">一般詢問</h3>
              <p className="text-gray-700 mb-2">
                如有任何問題或建議，請聯繫：
              </p>
              <p className="text-blue-600">info@taiwan-studyabroad.tw</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold mb-6">快速留言</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium">
                  您的姓名
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="請輸入您的姓名"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  電子郵件
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="請輸入您的電子郵件"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-sm font-medium">
                  留言內容
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="請輸入您的留言內容"
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full">
                送出留言
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA 區塊 */}
      <section className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">加入我們的留學社群</h2>
        <p className="mb-6 max-w-3xl mx-auto">
          無論您是即將出國留學的學生，或是已在海外的台灣人，都歡迎加入我們的社群，
          分享經驗、結交朋友、互相幫助！
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/community" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
            加入留學社群
          </Link>
          <Link href="/dashboard" className="btn-secondary border border-white bg-transparent hover:bg-blue-700">
            註冊帳號
          </Link>
        </div>
      </section>
    </div>
  );
} 