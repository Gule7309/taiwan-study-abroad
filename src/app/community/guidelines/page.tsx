'use client';

import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';

export default function GuidelinesPage() {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">社群規範</h1>
          <p className="text-gray-600 mb-8">
            為了維護留學社群的良好環境，我們制定了以下社群規範。所有用戶都必須遵守這些規則，以確保每個人都能有正面且有價值的社群體驗。
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">一、尊重與包容</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>尊重所有用戶，無論其背景、國籍、文化或教育程度如何</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>以禮貌和建設性的方式表達不同意見，鼓勵多元觀點的交流</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止發表歧視、侮辱、攻擊性言論或內容</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止任何形式的騷擾、仇恨言論或人身攻擊</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">二、內容品質與真實性</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>分享真實、準確的留學資訊和經驗</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>引用資料時請註明來源，尊重智慧財產權</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止發布虛假、誤導或未經證實的資訊</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止發布垃圾訊息或重複內容</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">三、廣告與商業行為</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>可以分享有助於留學生的資源和服務推薦，但須清楚標明是否有利益關係</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止未經允許的商業廣告、促銷或推銷內容</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止濫發私人訊息進行商業推廣</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">四、隱私與個人資訊</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>保護自己和他人的隱私，謹慎分享個人資訊</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>未經許可，禁止公開他人的私人聯絡方式、照片或個人資訊</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止冒充他人或使用多個帳號進行欺騙行為</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">五、專業交流與互助</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>鼓勵分享個人經驗、提供有建設性的建議和反饋</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>尊重不同教育階段的用戶，避免居高臨下或輕視他人</span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span>禁止惡意抨擊學校、教授、顧問或其他機構，但可以提供建設性的批評</span>
                </li>
              </ul>
            </section>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <FaQuestionCircle className="text-blue-600 mr-2" />
              如何報告違規內容？
            </h2>
            <p className="text-gray-600 mb-4">
              如果你發現任何違反社群規範的內容或行為，請透過以下方式向我們報告：
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>使用帖子或評論右上角的「檢舉」功能</li>
              <li>聯絡社群管理員：<a href="mailto:community@orgate.com" className="text-blue-600 hover:underline">community@orgate.com</a></li>
              <li>在檢舉內容時，請提供具體說明，以便我們更有效地處理</li>
            </ol>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              遵守這些社群規範有助於建立一個互相尊重、互相支持的留學社群環境。
              <br />感謝您的配合與貢獻！
            </p>
            <Link href="/community" className="btn-primary">
              返回社群
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 