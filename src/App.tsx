// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard'; // ✅ تم تعديل الاستيراد
import { Transactions } from './pages/Transactions'; // ✅ تم تعديل الاستيراد
import { Budget } from './pages/Budget'; // ✅ تم تعديل الاستيراد
import { Wallets } from './pages/Wallets'; // ✅ تم تعديل الاستيراد
import { Debts } from './pages/Debts'; // ✅ تم تعديل الاستيراد
import { Investments } from './pages/Investments'; // ✅ تم تعديل الاستيراد
import { Settings } from './pages/Settings'; // ✅ تم تعديل الاستيراد

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* تأكد من أن كل صفحة داخل <Layout> */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
        <Route path="/budget" element={<Layout><Budget /></Layout>} />
        <Route path="/wallets" element={<Layout><Wallets /></Layout>} />
        <Route path="/debts" element={<Layout><Debts /></Layout>} />
        <Route path="/investments" element={<Layout><Investments /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        {/* تم حذف /help لأنه غير موجود */}
      </Routes>
    </Router>
  );
};

export default App;