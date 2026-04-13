export type TransactionType = 'in' | 'out';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export interface TransactionStats {
  totalIn: number;
  totalOut: number;
  balance: number;
}
