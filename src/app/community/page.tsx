'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { FaComment, FaHeart, FaShare, FaUserCircle, FaSearch, FaThumbsUp, FaPaperPlane, FaFilter, FaGraduationCap } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

const forumCategories = [
  { id: 'usa', name: '美國留學', posts: 156 },
  { id: 'uk', name: '英國留學', posts: 89 },
  { id: 'australia', name: '澳洲留學', posts: 67 },
  { id: 'canada', name: '加拿大留學', posts: 52 },
  { id: 'japan', name: '日本留學', posts: 124 },
  { id: 'application', name: '申請準備', posts: 215 },
  { id: 'scholarship', name: '獎學金資訊', posts: 98 },
  { id: 'visa', name: '簽證相關', posts: 73 },
  { id: 'accommodation', name: '住宿與生活', posts: 105 },
];

const posts = [
  {
    id: 1,
    title: '美國大學申請時間規劃分享',
    author: '留學老手阿明',
    category: '美國留學',
    date: '2025/04/15',
    comments: 24,
    likes: 76,
    views: 432,
    content: '分享我申請美國大學的完整時間規劃，從準備托福到最終錄取通知...',
    tags: ['申請規劃', '美國大學', '時間管理'],
  },
  {
    id: 2,
    title: '在倫敦的生活費預算詳解',
    author: '英倫愛麗絲',
    category: '英國留學',
    date: '2025/04/13',
    comments: 15,
    likes: 42,
    views: 278,
    content: '我在倫敦留學一年的生活費詳細分析，包含租金、交通、飲食...',
    tags: ['生活費', '英國', '倫敦'],
  },
  {
    id: 3,
    title: '日本語言學校推薦與比較',
    author: '東京櫻花',
    category: '日本留學',
    date: '2025/04/12',
    comments: 31,
    likes: 58,
    views: 325,
    content: '整理了東京、大阪和京都十所優質語言學校的資訊與評價...',
    tags: ['語言學校', '日本', '日文學習'],
  },
  {
    id: 4,
    title: '如何準備成功的碩士申請文書？',
    author: '文書高手',
    category: '申請準備',
    date: '2025/04/10',
    comments: 19,
    likes: 87,
    views: 521,
    content: '分享我成功申請到五所頂尖大學的文書準備經驗與技巧...',
    tags: ['文書準備', '碩士申請', '個人陳述'],
  },
  {
    id: 5,
    title: '澳洲打工度假簽證申請全攻略',
    author: '澳洲袋鼠',
    category: '澳洲留學',
    date: '2025/04/08',
    comments: 27,
    likes: 63,
    views: 412,
    content: '澳洲打工度假簽證的申請流程、所需文件和注意事項...',
    tags: ['打工度假', '澳洲', '簽證'],
  },
];

// 包裝在Suspense中使用useSearchParams的組件
function TabManager({ onTabChange }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // 使用Effect鉤子將tabParam傳回父組件
  useState(() => {
    onTabChange(tabParam || 'forum');
  }, [tabParam, onTabChange]);
  
  return null;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('forum');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* 使用Suspense包裝useSearchParams */}
      <Suspense fallback={null}>
        <TabManager onTabChange={setActiveTab} />
      </Suspense>
      
      {/* 標籤頁選單 */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          <button
            className={`pb-4 px-4 ${
              activeTab === 'forum'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('forum')}
          >
            討論區
          </button>
          <button
            className={`pb-4 px-4 ${
              activeTab === 'mentors'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('mentors')}
          >
            學長姐社群
          </button>
          <button
            className={`pb-4 px-4 ${
              activeTab === 'events'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            活動資訊
          </button>
        </div>
      </div>

      {/* 討論區內容 */}
      {activeTab === 'forum' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左側欄目 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">討論區分類</h2>
              <ul className="space-y-3">
                {forumCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/community?category=${category.id}`}
                      className="flex justify-between items-center hover:text-blue-600 transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {category.posts}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">熱門標籤</h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #獎學金
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #簽證申請
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #學費
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #文化適應
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #語言考試
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #留學生活
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #讀書心得
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  #打工機會
                </span>
              </div>
            </div>
          </div>

          {/* 討論區主內容 */}
          <div className="lg:col-span-3">
            {/* 搜尋和篩選 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="搜尋討論主題..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-gray-600 border border-gray-300 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                    <FaFilter className="mr-2" /> 篩選
                  </button>
                  <Link href="/community/new" className="btn-primary">
                    發表主題
                  </Link>
                </div>
              </div>
            </div>

            {/* 文章列表 */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full mb-2 inline-block">
                          {post.category}
                        </span>
                        <h3 className="text-xl font-bold hover:text-blue-600 transition-colors">
                          <Link href={`/community/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {post.content}...
                      <Link href={`/community/${post.id}`} className="text-blue-600 ml-1 hover:underline">
                        閱讀更多
                      </Link>
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUserCircle className="mr-2" size={20} />
                        <span className="mr-4">{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaComment className="mr-1" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <FaHeart className="mr-1" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <FaShare className="mr-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">沒有找到相關的討論主題。</p>
                </div>
              )}
            </div>

            {/* 分頁 */}
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  上一頁
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-500 text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  下一頁
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 學長姐社群內容 */}
      {activeTab === 'mentors' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaGraduationCap className="mx-auto text-blue-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold mb-4">學長姐社群即將上線</h2>
          <p className="text-gray-600 mb-6">
            我們正在籌備學長姐社群功能，讓你能夠與已經在國外留學的學長姐們交流經驗。
          </p>
          <button className="btn-secondary">
            接收上線通知
          </button>
        </div>
      )}

      {/* 活動資訊內容 */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaGraduationCap className="mx-auto text-blue-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold mb-4">留學活動資訊即將上線</h2>
          <p className="text-gray-600 mb-6">
            我們正在整理全球各地的留學講座、教育展和說明會資訊，敬請期待。
          </p>
          <button className="btn-secondary">
            接收上線通知
          </button>
        </div>
      )}
    </>
  );
} 