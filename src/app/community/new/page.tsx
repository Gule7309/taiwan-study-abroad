'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaTags, FaImage, FaVideo, FaLink, FaFont } from 'react-icons/fa';

// 留學分類
const categories = [
  { id: 'usa', name: '美國留學' },
  { id: 'uk', name: '英國留學' },
  { id: 'australia', name: '澳洲留學' },
  { id: 'canada', name: '加拿大留學' },
  { id: 'japan', name: '日本留學' },
  { id: 'application', name: '申請準備' },
  { id: 'scholarship', name: '獎學金資訊' },
  { id: 'visa', name: '簽證相關' },
  { id: 'accommodation', name: '住宿與生活' },
];

// 熱門標籤
const popularTags = [
  '獎學金', '簽證申請', '學費', '文化適應', '語言考試', 
  '留學生活', '讀書心得', '打工機會', '申請規劃', '文書準備'
];

export default function NewPostPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // 標籤處理
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handlePopularTagClick = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };
  
  // 表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表單驗證
    if (title.trim() === '') {
      alert('請輸入標題');
      return;
    }
    
    if (content.trim() === '') {
      alert('請輸入內容');
      return;
    }
    
    if (category === '') {
      alert('請選擇分類');
      return;
    }
    
    // 在實際應用中，這裡應該發送API請求
    console.log({
      title,
      content,
      category,
      tags
    });
    
    alert('發布功能尚未實現，請設置後端API');
    
    // 成功後跳轉到社群頁面
    // router.push('/community');
  };
  
  return (
    <>
      <div className="mb-8">
        <Link 
          href="/community" 
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> 返回討論區
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">發表新主題</h1>
        
        <form onSubmit={handleSubmit}>
          {/* 標題 */}
          <div className="mb-6">
            <label htmlFor="title" className="block font-medium mb-2">
              標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="請輸入標題（5-100字）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          
          {/* 分類選擇 */}
          <div className="mb-6">
            <label htmlFor="category" className="block font-medium mb-2">
              分類 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- 請選擇分類 --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 標籤 */}
          <div className="mb-6">
            <label htmlFor="tags" className="block font-medium mb-2">
              標籤（最多5個）
            </label>
            <div className="mb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button 
                      type="button"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="tags"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="輸入標籤，按Enter或逗號添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={tags.length >= 5}
                  />
                  <FaTags className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={handleAddTag}
                  disabled={tags.length >= 5 || tagInput.trim() === ''}
                >
                  添加
                </button>
              </div>
            </div>
            
            {/* 熱門標籤 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">熱門標籤：</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`text-xs px-2 py-1 rounded-full ${
                      tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors`}
                    onClick={() => handlePopularTagClick(tag)}
                    disabled={tags.length >= 5 && !tags.includes(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 內容 */}
          <div className="mb-6">
            <label htmlFor="content" className="block font-medium mb-2">
              內容 <span className="text-red-500">*</span>
            </label>
            
            {/* 編輯器功能按鈕 */}
            <div className="flex border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-2 space-x-2">
              <button 
                type="button" 
                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                title="粗體"
              >
                <FaFont className="text-gray-700" />
              </button>
              <button 
                type="button" 
                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                title="添加圖片"
              >
                <FaImage className="text-gray-700" />
              </button>
              <button 
                type="button" 
                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                title="添加影片"
              >
                <FaVideo className="text-gray-700" />
              </button>
              <button 
                type="button" 
                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                title="添加連結"
              >
                <FaLink className="text-gray-700" />
              </button>
            </div>
            
            <textarea
              id="content"
              className="w-full p-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="請輸入內容（不少於10字）"
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              支持基本文字格式和圖片上傳，請遵守社群規範
            </p>
          </div>
          
          {/* 社群規範提示 */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">發帖提醒：</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>請確保內容真實準確，避免發布未經證實的資訊</li>
              <li>尊重他人，不發表歧視、攻擊性言論</li>
              <li>禁止發布廣告、垃圾訊息或重複內容</li>
              <li>如有引用資料，請註明來源</li>
            </ul>
          </div>
          
          {/* 提交按鈕 */}
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => router.push('/community')}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              發布主題
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 