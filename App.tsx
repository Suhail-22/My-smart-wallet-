
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TransactionForm } from './pages/TransactionForm';
import { Debts } from './pages/Debts';
import { Investments } from './pages/Investments';
import { Settings } from './pages/Settings';
import { Zakat } from './pages/Zakat';
import { Transactions } from './pages/Transactions';
import { Wallets } from './pages/Wallets';
import { Budget } from './pages/Budget';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<TransactionForm />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/zakat" element={<Zakat />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
