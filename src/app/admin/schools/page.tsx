'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import EditForm from '../components/EditForm';
import Modal from '../components/Modal';
import Link from 'next/link';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加載學校數據
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools');
      if (!response.ok) {
        throw new Error('獲取學校數據失敗');
      }
      const data = await response.json();
      setSchools(data.schools || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('獲取學校錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // 編輯學校
  const handleEdit = (school: any) => {
    setEditingSchool(school);
    setIsEditModalOpen(true);
  };

  // 刪除學校
  const handleDelete = async (school: any) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/schools/${school.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('刪除學校失敗');
      }
      
      // 刷新學校列表
      fetchSchools();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('刪除學校錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新學校
  const handleAdd = () => {
    setEditingSchool(null);
    setIsEditModalOpen(true);
  };

  // 提交表單
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      const url = editingSchool 
        ? `/api/schools/${editingSchool.id}` 
        : '/api/schools';
      
      const method = editingSchool ? 'PUT' : 'POST';
      
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
      fetchSchools();
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
    { key: 'name', label: '學校名稱' },
    { key: 'location', label: '位置' },
    { key: 'rating', label: '評分' },
    { 
      key: 'createdAt', 
      label: '創建時間',
      render: (value: any) => value ? new Date(value).toLocaleString() : '-'
    }
  ];

  // 表單字段定義
  const formFields = [
    { key: 'name', label: '學校名稱', type: 'text' as const, required: true },
    { key: 'description', label: '學校簡介', type: 'textarea' as const },
    { key: 'location', label: '位置', type: 'text' as const },
    { key: 'website', label: '網站', type: 'text' as const },
    { key: 'imageUrl', label: '圖片網址', type: 'text' as const },
    { key: 'rating', label: '評分', type: 'number' as const }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">學校管理</h1>
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
        data={schools}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        title="學校列表"
        isLoading={loading}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingSchool ? '編輯學校' : '新增學校'}
        size="lg"
      >
        <EditForm
          fields={formFields}
          initialData={editingSchool || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isSubmitting}
          title=""
          submitLabel={editingSchool ? '更新' : '創建'}
        />
      </Modal>
    </div>
  );
} 