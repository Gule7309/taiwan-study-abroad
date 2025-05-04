'use client';

import { useState, useEffect } from 'react';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'select' | 'date';
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

interface EditFormProps {
  fields: Field[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  title: string;
  submitLabel?: string;
}

export default function EditForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  title,
  submitLabel = '保存'
}: EditFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // 清除錯誤
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && (formData[field.key] === undefined || formData[field.key] === '' || formData[field.key] === null)) {
        newErrors[field.key] = `${field.label}是必填項`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: Field) => {
    const value = formData[field.key] !== undefined ? formData[field.key] : '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.key}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className={`w-full p-2 border rounded ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={field.placeholder}
            disabled={field.disabled || isLoading}
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            id={field.key}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className={`w-full p-2 border rounded ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}`}
            disabled={field.disabled || isLoading}
          >
            <option value="">-- 請選擇 --</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.key}
            value={value}
            onChange={(e) => handleChange(field.key, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className={`w-full p-2 border rounded ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={field.placeholder}
            disabled={field.disabled || isLoading}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
              {errors[field.key] && (
                <p className="mt-1 text-sm text-red-500">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              取消
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                處理中...
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 