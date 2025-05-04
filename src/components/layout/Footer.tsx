import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 關於我們 */}
          <div>
            <h3 className="text-xl font-bold mb-4">Orgate</h3>
            <p className="text-gray-400 mb-4">
              我們致力於為台灣學生提供全面、個性化的留學資訊服務，
              幫助學生找到最適合自己的留學選擇。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* 快速鏈接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速鏈接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  首頁
                </Link>
              </li>
              <li>
                <Link href="/schools" className="text-gray-400 hover:text-white transition-colors">
                  學校搜尋
                </Link>
              </li>
              <li>
                <Link href="/vr-tours" className="text-gray-400 hover:text-white transition-colors">
                  VR校園參觀
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">
                  留學社群
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  關於我們
                </Link>
              </li>
            </ul>
          </div>

          {/* 熱門留學國家 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">熱門留學國家</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/schools?country=usa" className="text-gray-400 hover:text-white transition-colors">
                  美國
                </Link>
              </li>
              <li>
                <Link href="/schools?country=uk" className="text-gray-400 hover:text-white transition-colors">
                  英國
                </Link>
              </li>
              <li>
                <Link href="/schools?country=australia" className="text-gray-400 hover:text-white transition-colors">
                  澳洲
                </Link>
              </li>
              <li>
                <Link href="/schools?country=canada" className="text-gray-400 hover:text-white transition-colors">
                  加拿大
                </Link>
              </li>
              <li>
                <Link href="/schools?country=japan" className="text-gray-400 hover:text-white transition-colors">
                  日本
                </Link>
              </li>
            </ul>
          </div>

          {/* 聯絡我們 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">聯絡我們</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">台北市信義區信義路五段7號</p>
              <p className="mb-2">電話: (02) 1234-5678</p>
              <p className="mb-2">信箱: info@taiwan-studyabroad.tw</p>
            </address>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Orgate 版權所有
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">
              隱私政策
            </Link>
            <Link href="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">
              使用條款
            </Link>
            <Link href="/cookies" className="text-gray-500 text-sm hover:text-white transition-colors">
              Cookie 政策
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 