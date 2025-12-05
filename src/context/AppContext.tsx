// src/context/AppContext.tsx - الجزء المتعلق بـ التصنيفات

// ... (بقية الاستيرادات)

// الحالة الأساسية للتصنيفات
const initialCategories: Category[] = [
  {
    id: 'food',
    label: 'الطعام',
    icon: '🍔',
    type: 'EXPENSE',
    children: [
      { id: 'fruits', label: 'فواكه', icon: '🍇', type: 'EXPENSE' },
      { id: 'sandwiches', label: 'سندوتشات', icon: '🥪', type: 'EXPENSE' },
      { id: 'meat', label: 'لحوم', icon: '🥩', type: 'EXPENSE' },
    ],
  },
  {
    id: 'transport',
    label: 'المواصلات',
    icon: '🚗',
    type: 'EXPENSE',
  },
  {
    id: 'salary',
    label: 'الراتب',
    icon: '💼',
    type: 'INCOME',
  },
  {
    id: 'gifts',
    label: 'الهدايا',
    icon: '🎁',
    type: 'INCOME',
  },
];

// داخل `AppProvider`:
const [categories, setCategories] = useState<Category[]>(initialCategories);

// دالة إضافة تصنيف رئيسي
const addCategory = (newCategory: Omit<Category, 'id'>) => {
  setCategories(prev => [...prev, { ...newCategory, id: crypto.randomUUID() }]);
};

// دالة إضافة تصنيف فرعي تحت تصنيف موجود
const addSubcategory = (parentId: string, newSubcategory: Omit<Category, 'id'>) => {
  setCategories(prev =>
    prev.map(cat => {
      if (cat.id === parentId) {
        const sub = { ...newSubcategory, id: crypto.randomUUID() };
        return {
          ...cat,
          children: [...(cat.children || []), sub],
        };
      }
      // البحث في الفئات الفرعية أيضًا (اختياري لدعم التداخل المتعدد)
      if (cat.children) {
        cat.children = cat.children.map(child => {
          if (child.id === parentId) {
            const sub = { ...newSubcategory, id: crypto.randomUUID() };
            return { ...child, children: [...(child.children || []), sub] };
          }
          return child;
        });
      }
      return cat;
    })
  );
};

// دالة تعديل تصنيف (رئيسي أو فرعي)
const updateCategory = (id: string, updatedData: Partial<Category>) => {
  const update = (cats: Category[]): Category[] => {
    return cats.map(cat => {
      if (cat.id === id) {
        return { ...cat, ...updatedData };
      }
      if (cat.children) {
        return { ...cat, children: update(cat.children) };
      }
      return cat;
    });
  };
  setCategories(prev => update(prev));
};

// دالة حذف تصنيف
const deleteCategory = (id: string) => {
  const remove = (cats: Category[]): Category[] => {
    return cats
      .filter(cat => cat.id !== id)
      .map(cat => {
        if (cat.children) {
          return { ...cat, children: remove(cat.children) };
        }
        return cat;
      });
  };
  setCategories(prev => remove(prev));
};

// في الـ value المُمرّر لـ Context Provider:
{
  categories,
  addCategory,
  addSubcategory,
  updateCategory,
  deleteCategory,
  // ... باقي الدوال
}