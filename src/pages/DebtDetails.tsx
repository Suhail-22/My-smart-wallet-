// src/pages/DebtDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Edit, Trash2, CheckCircle2, X } from 'lucide-react';
import { DebtType } from '../types';

const DebtDetails: React.FC = () => {
  const { contactName: encodedName } = useParams<{ contactName: string }>();
  const contactName = decodeURIComponent(encodedName || '');
  const { debts, updateDebt, deleteDebt } = useApp();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const personDebts = debts.filter(d => d.personName === contactName);

  const handleEditClick = (debt: any) => {
    setEditForm({
      id: debt.id,
      personName: debt.personName,
      amount: debt.amount,
      type: debt.type,
      dueDate: debt.dueDate || '',
      notes: debt.notes || '',
      icon: debt.icon || '💰',
      receiptImage: debt.receiptImage,
    });
    setEditingId(debt.id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      updateDebt(editForm.id, {
        personName: editForm.personName,
        amount: Number(editForm.amount),
        type: editForm.type,
        dueDate: editForm.dueDate || undefined,
        notes: editForm.notes || undefined,
        icon: editForm.icon,
        receiptImage: editForm.receiptImage,
      });
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
      deleteDebt(id);
    }
  };

  return (
    <div className="p-4 pt-20 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {contactName}
        </h1>
      </div>

      {editingId && editForm ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h2 className="text-lg font-bold mb-4">تعديل المعاملة</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">الطرف</label>
              <input
                type="text"
                value={editForm.personName}
                onChange={(e) => setEditForm({ ...editForm, personName: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">المبلغ</label>
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">النوع</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={DebtType.BORROWED}>عليّ (مدين)</option>
                <option value={DebtType.LENT}>لي (دائن)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">تاريخ الاستحقاق</label>
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">ملاحظات</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditForm(null);
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg"
              >
                حفظ التعديل
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {personDebts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              لا توجد معاملات مسجلة لهذا الشخص.
            </p>
          ) : (
            personDebts.map((debt) => (
              <div
                key={debt.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`font-bold ${
                        debt.type === DebtType.LENT
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {debt.type === DebtType.LENT ? '+' : '-'}
                      {debt.amount} YER
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {debt.notes || 'لا وصف'}
                    </p>
                    {debt.dueDate && (
                      <p className="text-xs text-gray-400">الاستحقاق: {debt.dueDate}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(debt)}
                      className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                      title="تعديل"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(debt.id)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DebtDetails;