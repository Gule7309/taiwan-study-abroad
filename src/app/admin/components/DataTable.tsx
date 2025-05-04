'use client';

import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onAdd?: () => void;
  title: string;
  isLoading?: boolean;
}

export default function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  title,
  isLoading = false
}: DataTableProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newSelectedItems: Record<string, boolean> = {};
    if (newSelectAll) {
      data.forEach((item, index) => {
        newSelectedItems[index] = true;
      });
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (index: number) => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems[index] = !newSelectedItems[index];
    setSelectedItems(newSelectedItems);
    
    const allSelected = data.every((_, i) => newSelectedItems[i]);
    setSelectAll(allSelected);
  };

  const handleBulkDelete = () => {
    const selectedItemsArray = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => data[parseInt(index)]);
      
    if (onDelete && selectedItemsArray.length > 0) {
      if (confirm(`確定要刪除選中的 ${selectedItemsArray.length} 項嗎？`)) {
        selectedItemsArray.forEach(item => onDelete(item));
        setSelectedItems({});
        setSelectAll(false);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          {Object.values(selectedItems).some(v => v) && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              批量刪除
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              新增
            </button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="w-full py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">載入中...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="w-full py-8 text-center text-gray-500">
          <p>沒有可顯示的數據</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                {columns.map((column) => (
                  <th key={column.key} className="border px-4 py-2">
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="border px-4 py-2 w-32">操作</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={!!selectedItems[index]}
                      onChange={() => handleSelectItem(index)}
                      className="rounded"
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="border px-4 py-2">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key] !== undefined
                          ? String(item[column.key])
                          : '-'}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="border px-4 py-2">
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                          >
                            編輯
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (confirm('確定要刪除此項嗎？')) {
                                onDelete(item);
                              }
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          >
                            刪除
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 