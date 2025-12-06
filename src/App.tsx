// src/App.tsx
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Debts from './pages/Debts';
import Investments from './pages/Investments';
import Settings from './pages/Settings';
import Zakat from './pages/Zakat';
import Transactions from './pages/Transactions';
import Wallets from './pages/Wallets';
import Budget from './pages/Budget';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/debts" element={<Layout><Debts /></Layout>} />
          <Route path="/investments" element={<Layout><Investments /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/zakat" element={<Layout><Zakat /></Layout>} />
          <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
          <Route path="/wallets" element={<Layout><Wallets /></Layout>} />
          <Route path="/budget" element={<Layout><Budget /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;