export interface User {
  id: string;
  name: string;
  email: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: string;
  date: string;
}

export interface ExpenseSummary {
  category: string;
  total: number;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categorySummary: ExpenseSummary[];
}
