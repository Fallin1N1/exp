export type TransactionType = "income" | "expense";

export interface Account {
  id: number;
  name: string;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface Transaction {
  id: number;
  desc: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  accountId: number;
  accountName: string;
}

export const incomeCategories = [
  "Salary",
  "Startup income",
  "Freelance",
  "Other income",
] as const;

export const expenseCategories = [
  "Daily expenses",
  "Bills",
  "Fuel",
  "Food",
  "Transport",
  "Rent",
  "EMI",
  "Shopping",
  "Entertainment",
  "Medical",
  "Other",
] as const;
