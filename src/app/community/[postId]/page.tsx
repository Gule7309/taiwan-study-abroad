'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaUserCircle, FaHeart, FaRegHeart, FaShare, FaComment, FaArrowLeft, FaThumbsUp, FaPaperPlane } from 'react-icons/fa';

// 模擬帖子數據
const posts = [
  {
    id: "1",
    title: '美國大學申請時間規劃分享',
    author: '留學老手阿明',
    avatar: '',
    category: '美國留學',
    date: '2025/04/15',
    comments: 24,
    likes: 76,
    views: 432,
    content: `<p>分享我申請美國大學的完整時間規劃，從準備托福到最終錄取通知...</p>

<p>大家好，我是阿明，去年成功申請到了UC Berkeley的計算機科學專業，今天想和大家分享我的申請時間線和一些心得。</p>

<h3>申請前一年夏天（2024年6-8月）</h3>
<ul>
  <li>確定目標學校清單：根據專業排名、地理位置和獎學金機會列出了15所目標學校</li>
  <li>開始準備托福：每天2-3小時的密集學習計劃，目標分數105+</li>
  <li>研究每所學校的申請要求和截止日期：建立詳細的Excel表格追蹤</li>
</ul>

<h3>申請前一年秋季（2024年9-11月）</h3>
<ul>
  <li>9月初參加第一次托福考試：獲得99分，決定再次嘗試</li>
  <li>10月初參加第二次托福考試：獲得107分，達到目標</li>
  <li>開始撰寫個人陳述：經過5次大修，定稿</li>
  <li>聯繫推薦人：提前一個月給予準備時間</li>
</ul>

<h3>申請前一年冬季（2024年12月-2025年1月）</h3>
<ul>
  <li>完成所有網申：提前兩週完成每個截止日期的申請</li>
  <li>申請獎學金：同時申請校內和校外獎學金</li>
  <li>準備可能的面試：模擬練習常見問題</li>
</ul>

<h3>申請當年春季（2025年2-4月）</h3>
<ul>
  <li>2-3月：陸續收到錄取結果</li>
  <li>3月底：比較不同學校的offer和獎學金情況</li>
  <li>4月：做出最終決定，確認UC Berkeley</li>
</ul>

<p>一些建議：</p>
<ol>
  <li>儘早開始準備語言考試，預留重考的時間</li>
  <li>申請文書需要多次修改，不要拖到最後一刻</li>
  <li>多和已經在國外的學長姐交流，獲取第一手資訊</li>
  <li>提前了解簽證流程，以免錯過重要時間點</li>
</ol>

<p>希望我的經驗對大家有所幫助，如有任何問題，歡迎在評論區提問！</p>`,
    tags: ['申請規劃', '美國大學', '時間管理'],
  },
  {
    id: "2",
    title: '在倫敦的生活費預算詳解',
    author: '英倫愛麗絲',
    avatar: '',
    category: '英國留學',
    date: '2025/04/13',
    comments: 15,
    likes: 42,
    views: 278,
    content: '我在倫敦留學一年的生活費詳細分析，包含租金、交通、飲食...',
    tags: ['生活費', '英國', '倫敦'],
  },
  {
    id: "3",
    title: '日本語言學校推薦與比較',
    author: '東京櫻花',
    avatar: '',
    category: '日本留學',
    date: '2025/04/12',
    comments: 31,
    likes: 58,
    views: 325,
    content: '整理了東京、大阪和京都十所優質語言學校的資訊與評價...',
    tags: ['語言學校', '日本', '日文學習'],
  },
];

// 模擬評論數據
const comments = [
  {
    id: 1,
    postId: "1",
    author: '小志',
    avatar: '',
    date: '2025/04/16',
    content: '謝謝分享！想請問你托福準備的具體方法是什麼？有推薦的學習資源嗎？',
    likes: 5,
    replies: [
      {
        id: 101,
        author: '留學老手阿明',
        avatar: '',
        date: '2025/04/16',
        content: '我主要用的是ETS官方指南和TPO真題，另外會看YouTube上的TED演講訓練聽力。推薦Magoosh的線上課程，很有系統！',
        likes: 2,
      }
    ]
  },
  {
    id: 2,
    postId: "1",
    author: '留學新手',
    avatar: '',
    date: '2025/04/16',
    content: '請問UC Berkeley的獎學金申請流程複雜嗎？國際生有什麼需要特別注意的地方？',
    likes: 3,
    replies: []
  },
  {
    id: 3, 
    postId: "1",
    author: '未來的CS人',
    avatar: '',
    date: '2025/04/17',
    content: '你覺得申請CS專業最重要的是GPA還是專案經驗？我目前有幾個GitHub專案但GPA不是很理想...',
    likes: 8,
    replies: [
      {
        id: 102,
        author: '留學老手阿明',
        avatar: '',
        date: '2025/04/17',
        content: '對CS來說，實際的項目經驗非常重要！我的建議是在個人陳述中詳細描述你的項目，特別是展示你的解決問題能力和技術深度。當然GPA也不能太低，但好的專案可以彌補一些。',
        likes: 4,
      }
    ]
  },
];

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  
  const [post, setPost] = useState<any>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    // 獲取帖子詳情
    const currentPost = posts.find(p => p.id === postId);
    if (currentPost) {
      setPost(currentPost);
      
      // 獲取評論
      const filteredComments = comments.filter(c => c.postId === postId);
      setPostComments(filteredComments);
      
      // 獲取相關帖子 (同一類別的其他帖子)
      const filtered = posts
        .filter(p => p.id !== postId && p.category === currentPost.category)
        .slice(0, 3);
      setRelatedPosts(filtered);
    } else {
      // 帖子不存在，跳轉到社群頁面
      router.push('/community');
    }
  }, [postId, router]);
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    
    // 在實際應用中，這裡應該發送API請求
    alert('留言功能尚未實現，請設置後端API');
    setCommentText('');
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    // 在實際應用中，這裡應該發送API請求更新點讚狀態
  };
  
  if (!post) {
    return <div className="text-center">載入中...</div>;
  }
  
  return (
    <>
      <div className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> 返回討論區
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主內容 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* 帖子頭部 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <div className="text-sm text-gray-500">
                  {post.date} · {post.views} 次瀏覽
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center flex-grow">
                  <FaUserCircle className="mr-2 text-gray-400" size={24} />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleLike} 
                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {isLiked ? (
                      <FaHeart className="mr-1 text-red-500" />
                    ) : (
                      <FaRegHeart className="mr-1" />
                    )}
                    <span>{post.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                    <FaShare className="mr-1" />
                    <span>分享</span>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              </div>
            </div>
            
            {/* 標籤 */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {post.tags.map((tag: string, index: number) => (
                <Link 
                  href={`/community?tag=${tag}`} 
                  key={index} 
                  className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
          
          {/* 評論區 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">評論 ({postComments.length})</h2>
            
            {/* 發表評論 */}
            <div className="mb-8">
              <form onSubmit={handleCommentSubmit}>
                <div className="flex mb-3">
                  <FaUserCircle className="text-gray-400 mr-3 mt-1" size={24} />
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="分享你的想法..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center"
                    disabled={commentText.trim() === ''}
                  >
                    <FaPaperPlane className="mr-2" /> 發表評論
                  </button>
                </div>
              </form>
            </div>
            
            {/* 評論列表 */}
            <div className="space-y-6">
              {postComments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-6">
                  <div className="flex mb-3">
                    <FaUserCircle className="text-gray-400 mr-3 mt-1" size={20} />
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <div>
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-gray-500 ml-2">{comment.date}</span>
                        </div>
                        <button className="text-gray-400 hover:text-blue-500 transition-colors">
                          <FaThumbsUp /> <span className="text-xs">{comment.likes}</span>
                        </button>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      
                      {/* 回覆按鈕 */}
                      <div className="mt-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                          回覆
                        </button>
                      </div>
                      
                      {/* 回覆列表 */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex mb-1">
                                <FaUserCircle className="text-gray-400 mr-2 mt-1" size={16} />
                                <div className="flex-grow">
                                  <div className="flex justify-between">
                                    <div>
                                      <span className="font-medium">{reply.author}</span>
                                      <span className="text-xs text-gray-500 ml-2">{reply.date}</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                                      <FaThumbsUp /> <span className="text-xs">{reply.likes}</span>
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 側邊欄 */}
        <div className="lg:col-span-1">
          {/* 作者信息 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">關於作者</h3>
            <div className="flex items-center mb-4">
              <FaUserCircle className="text-gray-400 mr-3" size={40} />
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">發表了 23 篇文章</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {post.author === '留學老手阿明' && '2024年畢業於UC Berkeley計算機科學專業，擅長留學申請規劃與文書指導。'}
              {post.author === '英倫愛麗絲' && '在倫敦學習與生活3年，熟悉英國留學相關事務，喜歡分享留學生活點滴。'}
              {post.author === '東京櫻花' && '日本留學經驗豐富，目前就讀東京大學碩士班，熱愛日本文化與語言。'}
            </p>
            <button className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors">
              追蹤作者
            </button>
          </div>
          
          {/* 相關帖子 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">相關文章</h3>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <Link 
                    href={`/community/${relatedPost.id}`} 
                    className="block hover:text-blue-600 transition-colors"
                  >
                    <h4 className="font-medium mb-1">{relatedPost.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{relatedPost.author}</span>
                      <span className="flex items-center">
                        <FaComment className="mr-1" size={12} />
                        {relatedPost.comments}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 