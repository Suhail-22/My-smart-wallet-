// src/pages/CategoriesManager.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const CategoriesManager: React.FC = () => {
  const { categories, addCategory, addSubcategory, updateCategory, deleteCategory } = useApp();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newIcon, setNewIcon] = useState('');

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCategory = () => {
    const label = prompt('أدخل اسم التصنيف الجديد (مثل: "الطعام"):');
    if (!label) return;
    const icon = prompt('أدخل الرمز (يمكنك نسخه من جهازك، مثل: 🍔):', '🔘');
    if (!icon) return;
    addCategory({ label, icon, type: 'EXPENSE' });
  };

  const handleAddSubcategory = (parentId: string) => {
    const label = prompt('أدخل اسم الفئة الفرعية (مثل: "فواكه"):');
    if (!label) return;
    const icon = prompt('أدخل الرمز (مثل: 🍎):', '⚪');
    if (!icon) return;
    addSubcategory(parentId, { label, icon, type: 'EXPENSE' });
  };

  const handleEditCategory = (id: string, currentLabel: string, currentIcon: string) => {
    const newLabel = prompt('عدّل الاسم:', currentLabel);
    if (newLabel === null) return;
    const newIcon = prompt('عدّل الرمز:', currentIcon);
    if (newIcon === null) return;
    updateCategory(id, { label: newLabel || currentLabel, icon: newIcon || currentIcon });
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف وجميع فروعه؟')) {
      deleteCategory(id);
    }
  };

  const renderCategory = (category: any, level = 0) => {
    const isExpanded = expanded[category.id];
    return (
      <div key={category.id} className="mb-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center">
            <span className={`text-2xl mr-2 ${level > 0 ? 'ml-4' : ''}`}>{category.icon}</span>
            <span className="font-medium">{category.label}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => handleEditCategory(category.id, category.label, category.icon)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
            {category.children && category.children.length > 0 && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}
          </div>
        </div>

        {isExpanded && category.children && (
          <div className="mt-2 ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
            {category.children.map((child: any) => renderCategory(child, level + 1))}
          </div>
        )}

        {level === 0 && (
          <button
            onClick={() => handleAddSubcategory(category.id)}
            className="mt-2 flex items-center text-sm text-green-600 hover:text-green-800"
          >
            <PlusCircle size={16} className="ml-1" /> إضافة فئة فرعية
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 pt-20 pb-24">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-6">إدارة الرموز والفئات</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        أضف رموزًا رئيسية (مثل 🍔)، ثم أضف تحتها فئات فرعية (مثل فواكه، سندوتشات...).
      </p>

      <div className="space-y-4">
        {categories.map(cat => renderCategory(cat))}
      </div>

      <button
        onClick={handleAddCategory}
        className="w-full mt-8 py-3 bg-primary-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <PlusCircle size={20} /> إضافة رمز جديد
      </button>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>نصيحة:</strong> يمكنك نسخ الرموز من أي مكان في جهازك (مثل لوحة المفاتيح أو تطبيق الرموز) واللصق هنا!
        </p>
      </div>
    </div>
  );
};

export default CategoriesManager;