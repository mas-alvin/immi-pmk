export type PaymentMethod = 'online' | 'offline' | '';

export interface MemberPayment {
  no: number;
  nama: string;
  t1: string;
  v1: number;
  m1: PaymentMethod;
  t2: string;
  v2: number;
  m2: PaymentMethod;
}

export interface MonthlyStats {
  totalOnline: number;
  totalOffline: number;
  totalKas: number;
}

export interface LedgerEntry {
  tanggal: string;
  saldo: number; // Saldo awal (usually 0 except first)
  masuk: number;
  keluar: number;
  sisa: number;
  ket: string;
}
