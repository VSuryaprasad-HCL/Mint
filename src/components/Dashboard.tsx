import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, PiggyBank, Lightbulb } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 24650.80);

  const monthlySpending = transactions
    .filter((t) => t.type === 'expense' && t.date.getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlySavings = transactions
    .filter((t) => t.type === 'income' && t.date.getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0) - monthlySpending;

  const spendingData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const spending = transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.date.getMonth() === month.getMonth() &&
          t.date.getFullYear() === month.getFullYear()
      )
      .reduce((acc, curr) => acc + curr.amount, 0);
    return {
      name: month.toLocaleString('default', { month: 'short' }),
      spending: spending || Math.random() * 3000 + 1000, // Fallback to random data for demo
    };
  }).reverse();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8 text-emerald-500" />
            <span className="px-2 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
              +2.5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm">Total Balance</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-8 w-8 text-blue-500" />
            <ArrowDownRight className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="text-gray-500 text-sm">Monthly Spending</h3>
          <p className="text-2xl font-bold">{formatCurrency(monthlySpending)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <PiggyBank className="h-8 w-8 text-purple-500" />
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="text-gray-500 text-sm">Monthly Savings</h3>
          <p className="text-2xl font-bold">{formatCurrency(monthlySavings)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Lightbulb className="h-8 w-8 text-amber-500" />
            <span className="px-2 py-1 rounded-full text-sm bg-amber-100 text-amber-800">3 New</span>
          </div>
          <h3 className="text-gray-500 text-sm">AI Insights</h3>
          <p className="text-lg font-medium">View Recommendations</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Spending Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spending" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.slice(-3).reverse().map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
              <p
                className={cn(
                  'font-medium',
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}