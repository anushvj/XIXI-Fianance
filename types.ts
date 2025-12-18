
export type TransactionType = 'income' | 'expense' | 'savings' | 'loans';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface FinancialInsight {
  summary: string;
  tips: string[];
  projectedSavings: number;
  warnings: string[];
  categoryAnalysis: { category: string; insight: string }[];
  recurringExpenses: { description: string; amount: number; frequency: string }[];
  metrics: {
    debtToIncomeRatio: number;
    savingsRate: number;
  };
}

export const CATEGORIES: Record<TransactionType, string[]> = {
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
  expense: ['Rent', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Other'],
  savings: ['Emergency Fund', 'Retirement', 'Travel', 'Education', 'Investment Pot'],
  loans: ['Home Loan', 'Personal Loan', 'Car Loan', 'Credit Card Debt', 'Education Loan', 'Business Loan', 'Other'],
};
