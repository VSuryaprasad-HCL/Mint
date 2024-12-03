import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '../lib/utils';

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface MonthlySpendingProps {
  transactions: Transaction[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#6b7280'];

export function MonthlySpending({ transactions }: MonthlySpendingProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(
    (t) => t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
  );

  const expensesByCategory = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const dailySpending = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      const day = curr.date.getDate();
      acc[day] = (acc[day] || 0) + curr.amount;
      return acc;
    }, {} as Record<number, number>);

  const barData = Object.entries(dailySpending).map(([day, amount]) => ({
    day: `Day ${day}`,
    amount,
  }));

  const totalSpending = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Monthly Spending Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Daily Spending Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
          <div className="space-y-4">
            {monthlyTransactions
              .filter((t) => t.type === 'expense')
              .map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.category} • {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-medium text-red-600">
                    -{formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}