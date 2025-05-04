'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBookmark, FaUserCircle, FaComment, FaHeart, FaEllipsisH, FaFolder, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';

// 模擬收藏數據
const bookmarksData = [
  {
    id: 1,
    title: '2026年美國Top30大學申請截止日期整理',
    author: '留學顧問張小明',
    category: '美國留學',
    date: '2025/04/10',
    comments: 37,
    likes: 126,
    excerpt: '本文整理了2026學年美國前30大學的RD和ED申請截止日期，包含部分獎學金申請信息...',
    folders: ['申請規劃', '重要日期'],
    saved: '3天前'
  },
  {
    id: 2,
    title: '如何準備一份出色的留學申請文書',
    author: '文書專家李教授',
    category: '申請準備',
    date: '2025/04/05',
    comments: 42,
    likes: 189,
    excerpt: '從整體結構到語言表達，分享如何寫出能打動招生委員會的個人陳述和文書材料...',
    folders: ['文書準備'],
    saved: '5天前'
  },
  {
    id: 3,
    title: '英國碩士申請全攻略：從選校到簽證',
    author: '英倫愛麗絲',
    category: '英國留學',
    date: '2025/03/28',
    comments: 29,
    likes: 105,
    excerpt: '一篇文章全面解析英國碩士申請流程，包含UCAS系統使用、語言考試、獎學金和簽證申請...',
    folders: ['英國留學', '碩士申請'],
    saved: '1週前'
  },
  {
    id: 4,
    title: '日本語言學校如何選擇？十大語言學校比較',
    author: '東京櫻花',
    category: '日本留學',
    date: '2025/03/20',
    comments: 51,
    likes: 134,
    excerpt: '詳細比較東京、大阪和京都的十所優質語言學校，分析學費、課程設置、升學率等因素...',
    folders: ['日本留學'],
    saved: '2週前'
  },
  {
    id: 5,
    title: '留學生海外租房全指南：注意事項與平台推薦',
    author: '環球房屋達人',
    category: '住宿與生活',
    date: '2025/03/10',
    comments: 64,
    likes: 210,
    excerpt: '分享各國留學生租房經驗，包含常見陷阱、可靠平台以及如何與房東有效溝通...',
    folders: [],
    saved: '3週前'
  },
];

// 模擬文件夾數據
const foldersData = [
  { id: 1, name: '申請規劃', count: 5 },
  { id: 2, name: '文書準備', count: 2 },
  { id: 3, name: '英國留學', count: 7 },
  { id: 4, name: '美國留學', count: 4 },
  { id: 5, name: '日本留學', count: 3 },
  { id: 6, name: '獎學金', count: 2 },
  { id: 7, name: '碩士申請', count: 6 },
  { id: 8, name: '重要日期', count: 1 },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(bookmarksData);
  const [folders, setFolders] = useState(foldersData);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // 篩選收藏
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesFolder = selectedFolder === 'all' || bookmark.folders.includes(selectedFolder);
    const matchesSearch = searchTerm === '' || 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFolder && matchesSearch;
  });

  // 添加新文件夾
  const handleAddFolder = () => {
    if (newFolderName.trim() === '') return;
    
    const newFolder = {
      id: folders.length + 1,
      name: newFolderName.trim(),
      count: 0
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  // 從收藏中移除
  const removeFromBookmarks = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };
  
  // 添加文章到文件夾
  const addToFolder = (bookmarkId: number, folderName: string) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === bookmarkId && !bookmark.folders.includes(folderName) 
        ? {...bookmark, folders: [...bookmark.folders, folderName]} 
        : bookmark
    ));
    
    // 更新文件夾計數
    setFolders(folders.map(folder => 
      folder.name === folderName 
        ? {...folder, count: folder.count + 1} 
        : folder
    ));
  };
  
  // 從文件夾中移除
  const removeFromFolder = (bookmarkId: number, folderName: string) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === bookmarkId 
        ? {...bookmark, folders: bookmark.folders.filter(f => f !== folderName)} 
        : bookmark
    ));
    
    // 更新文件夾計數
    setFolders(folders.map(folder => 
      folder.name === folderName 
        ? {...folder, count: Math.max(0, folder.count - 1)} 
        : folder
    ));
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">我的收藏</h1>
          <div className="relative mt-2 md:mt-0 w-full md:w-auto md:min-w-[300px]">
            <input
              type="text"
              placeholder="搜尋收藏..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左側文件夾列表 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">文件夾</h3>
                <button 
                  onClick={() => setShowNewFolderInput(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaPlus size={12} className="inline mr-1" /> 新增
                </button>
              </div>
              
              {showNewFolderInput && (
                <div className="mb-3 flex">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="文件夾名稱"
                    className="flex-grow text-sm p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleAddFolder}
                    className="bg-blue-600 text-white px-3 rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    確定
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setNewFolderName('');
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedFolder('all')}
                    className={`flex justify-between items-center w-full p-2 rounded-md ${
                      selectedFolder === 'all' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <FaBookmark className="mr-2" size={14} /> 全部收藏
                    </span>
                    <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {bookmarks.length}
                    </span>
                  </button>
                </li>
                {folders.map((folder) => (
                  <li key={folder.id}>
                    <button
                      onClick={() => setSelectedFolder(folder.name)}
                      className={`flex justify-between items-center w-full p-2 rounded-md ${
                        selectedFolder === folder.name 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center">
                        <FaFolder className="mr-2" size={14} /> {folder.name}
                      </span>
                      <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {folder.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* 右側收藏列表 */}
          <div className="lg:col-span-3">
            {filteredBookmarks.length > 0 ? (
              <div className="space-y-6">
                {filteredBookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {bookmark.category}
                        </span>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">收藏於 {bookmark.saved}</span>
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                              <FaEllipsisH size={14} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                              <div className="py-1">
                                <p className="px-4 py-2 text-sm text-gray-700 font-medium border-b">添加到文件夾</p>
                                <div className="max-h-40 overflow-y-auto">
                                  {folders.map((folder) => (
                                    <button
                                      key={folder.id}
                                      onClick={() => 
                                        bookmark.folders.includes(folder.name) 
                                          ? removeFromFolder(bookmark.id, folder.name) 
                                          : addToFolder(bookmark.id, folder.name)
                                      }
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <span className="mr-2">
                                        {bookmark.folders.includes(folder.name) ? '✓' : ''}
                                      </span>
                                      {folder.name}
                                    </button>
                                  ))}
                                </div>
                                <div className="border-t">
                                  <button
                                    onClick={() => removeFromBookmarks(bookmark.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    移除收藏
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/community/${bookmark.id}`}>
                        <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
                          {bookmark.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-4">
                        {bookmark.excerpt}
                      </p>
                      
                      {bookmark.folders.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {bookmark.folders.map((folder, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md flex items-center">
                              <FaFolder className="mr-1" size={10} /> {folder}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUserCircle className="mr-2" size={18} />
                          <span className="mr-4">{bookmark.author}</span>
                          <span>{bookmark.date}</span>
                        </div>
                        
                        <div className="flex space-x-4 text-gray-500 text-sm">
                          <span className="flex items-center">
                            <FaComment className="mr-1" /> {bookmark.comments}
                          </span>
                          <span className="flex items-center">
                            <FaHeart className="mr-1" /> {bookmark.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FaBookmark className="mx-auto text-gray-300 mb-3" size={32} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">未找到收藏</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? '無符合搜尋條件的收藏內容' 
                    : selectedFolder !== 'all' 
                      ? `您在「${selectedFolder}」文件夾中沒有收藏內容` 
                      : '您還沒有收藏任何文章'}
                </p>
                <Link href="/community" className="mt-4 inline-block btn-primary">
                  瀏覽社群文章
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 