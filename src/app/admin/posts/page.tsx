'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import EditForm from '../components/EditForm';
import Modal from '../components/Modal';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加載貼文數據和用戶數據
  const fetchData = async () => {
    try {
      setLoading(true);
      // 獲取貼文
      const postsResponse = await fetch('/api/community');
      if (!postsResponse.ok) {
        throw new Error('獲取貼文數據失敗');
      }
      const postsData = await postsResponse.json();
      setPosts(postsData.posts || []);

      // 獲取用戶列表（用於作者選擇）
      const usersResponse = await fetch('/api/users');
      if (!usersResponse.ok) {
        throw new Error('獲取用戶數據失敗');
      }
      const usersData = await usersResponse.json();
      setUsers(usersData || []);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('獲取數據錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 編輯貼文
  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  // 刪除貼文
  const handleDelete = async (post: any) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/${post.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('刪除貼文失敗');
      }
      
      // 刷新貼文列表
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('刪除貼文錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新貼文
  const handleAdd = () => {
    setEditingPost(null);
    setIsEditModalOpen(true);
  };

  // 提交表單
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      const url = editingPost 
        ? `/api/community/${editingPost.id}` 
        : '/api/community';
      
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '操作失敗');
      }
      
      // 關閉模態窗口並刷新數據
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('提交表單錯誤:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 根據作者ID獲取作者姓名
  const getAuthorName = (authorId: string) => {
    const author = users.find(user => user.id === authorId);
    return author ? author.name || author.email : authorId;
  };

  // 表格列定義
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: '標題' },
    { 
      key: 'content', 
      label: '內容',
      render: (value: string) => value?.length > 50 ? `${value.substring(0, 50)}...` : value
    },
    { 
      key: 'authorId', 
      label: '作者',
      render: (value: string) => getAuthorName(value)
    },
    { 
      key: 'createdAt', 
      label: '創建時間',
      render: (value: any) => value ? new Date(value).toLocaleString() : '-'
    }
  ];

  // 準備作者選項
  const authorOptions = users.map(user => ({
    value: user.id,
    label: user.name || user.email
  }));

  // 表單字段定義
  const formFields = [
    { key: 'title', label: '標題', type: 'text' as const, required: true },
    { key: 'content', label: '內容', type: 'textarea' as const, required: true },
    { 
      key: 'authorId', 
      label: '作者', 
      type: 'select' as const, 
      required: true,
      options: authorOptions
    },
    { key: 'imageUrl', label: '圖片網址', type: 'text' as const }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">貼文管理</h1>
        <Link href="/admin" className="text-blue-500 hover:underline">
          返回管理首頁
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <DataTable
        data={posts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        title="貼文列表"
        isLoading={loading}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingPost ? '編輯貼文' : '新增貼文'}
        size="lg"
      >
        <EditForm
          fields={formFields}
          initialData={editingPost || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isSubmitting}
          title=""
          submitLabel={editingPost ? '更新' : '創建'}
        />
      </Modal>
    </div>
  );
} 