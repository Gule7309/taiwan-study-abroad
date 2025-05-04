'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import EditForm from '../components/EditForm';
import Modal from '../components/Modal';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加載用戶數據
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('獲取用戶數據失敗');
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('獲取用戶錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 編輯用戶
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // 刪除用戶
  const handleDelete = async (user: any) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('刪除用戶失敗');
      }
      
      // 刷新用戶列表
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('刪除用戶錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新用戶
  const handleAdd = () => {
    setEditingUser(null);
    setIsEditModalOpen(true);
  };

  // 提交表單
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      const url = editingUser 
        ? `/api/users/${editingUser.id}` 
        : '/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
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
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('提交表單錯誤:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 表格列定義
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '姓名' },
    { key: 'email', label: '電子郵件' },
    { key: 'role', label: '角色' },
    { 
      key: 'createdAt', 
      label: '創建時間',
      render: (value: any) => new Date(value).toLocaleString()
    }
  ];

  // 表單字段定義
  const formFields = [
    { key: 'name', label: '姓名', type: 'text' as const, required: true },
    { key: 'email', label: '電子郵件', type: 'email' as const, required: true },
    ...(!editingUser ? [{ key: 'password', label: '密碼', type: 'password' as const, required: true }] : []),
    { 
      key: 'role', 
      label: '角色', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'USER', label: '一般用戶' },
        { value: 'ADMIN', label: '管理員' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用戶管理</h1>
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
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        title="用戶列表"
        isLoading={loading}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingUser ? '編輯用戶' : '新增用戶'}
        size="lg"
      >
        <EditForm
          fields={formFields}
          initialData={editingUser || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isSubmitting}
          title=""
          submitLabel={editingUser ? '更新' : '創建'}
        />
      </Modal>
    </div>
  );
} 