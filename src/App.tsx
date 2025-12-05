// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Wallets from './pages/Wallets';
import Debts from './pages/Debts';
import Investments from './pages/Investments';
import Settings from './pages/Settings';
import Help from './pages/Help';

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
        <Route path="/help" element={<Layout><Help /></Layout>} />
        {/* لا حاجة لصفحة /add منفصلة — الزر العائم يكفي */}
      </Routes>
    </Router>
  );
};

export default App;