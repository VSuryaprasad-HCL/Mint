import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MonthlySpending } from './components/MonthlySpending';
import { Login } from './components/Login';
import { TransactionForm } from './components/TransactionForm';
import { initDb, validateUser, createUser, saveTransaction, getTransactions } from './lib/db';

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface User {
  id: number;
  email: string;
  name: string | null;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    initDb();
  }, []);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (user) {
      const loadedTransactions = await getTransactions(user.id);
      setTransactions(loadedTransactions);
      setFilteredTransactions(loadedTransactions);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const validatedUser = await validateUser(email, password);
    if (validatedUser) {
      setUser(validatedUser);
      return true;
    }
    return false;
  };

  const handleSignUp = async (email: string, password: string, name?: string) => {
    try {
      await createUser({ email, password, name });
      const user = await validateUser(email, password);
      if (user) {
        setUser(user);
        return true;
      }
    } catch (error) {
      console.error('Sign up failed:', error);
    }
    return false;
  };

  const handleNewTransaction = async (transaction: Transaction) => {
    if (user) {
      await saveTransaction(user.id, transaction);
      await loadTransactions();
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(query.toLowerCase()) ||
        transaction.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  if (!user) {
    return <Login onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Dashboard transactions={filteredTransactions} />
                  </div>
                  <div>
                    <TransactionForm onSubmit={handleNewTransaction} />
                  </div>
                </div>
              </main>
            }
          />
          <Route
            path="/monthly-spending"
            element={<MonthlySpending transactions={transactions} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;