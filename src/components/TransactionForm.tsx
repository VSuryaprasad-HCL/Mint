import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: Date;
  }) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
    });
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setType('income')}
            className={cn(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium',
              type === 'income'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={cn(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium',
              type === 'expense'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Expense
          </button>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="mt-1">
            <input
              type="date"
              id="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="amount"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select a category</option>
            {type === 'income' ? (
              <>
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investments">Investments</option>
                <option value="other">Other</option>
              </>
            ) : (
              <>
                <option value="food">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </form>
    </div>
  );
}