import { useState, useEffect, useMemo } from 'react';
import type { Transaction, TransactionStats } from '../types/index';
import { toast } from 'react-toastify';

// Vite proxy path during dev, full path for production
const SCRIPT_ID = 'AKfycbxenTYO7KHcgWtsyVDpMXXok5z37WPMXe0oMhfB8lCSOhVgzGV7TEbZXNOHLmQlqfI';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      
      // Validasi apakah data adalah array
      if (!Array.isArray(data)) {
        console.error('Data received is not an array:', data);
        if (data.error) {
          toast.error(`Script Error: ${data.error}`);
        } else {
          toast.error('Format data dari Google Sheets tidak valid (Bukan Array)');
        }
        return;
      }

      // Data format dari Apps Script: [{tanggal: ..., nama: ..., nominal: ..., jumlah: ...}]
      const mapped = data.map((item: any, index: number) => ({
        id: item.id || `row-${index}`,
        title: item.nama || 'Tanpa Nama',
        amount: Number(item.nominal || 0),
        type: (item.jumlah === 'Masuk' || item.type === 'in') ? 'in' : 'out',
        date: item.tanggal || new Date().toISOString(),
        category: 'Umum',
      }));
      
      setTransactions(mapped);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Gagal mengambil data (Cek Deployment Apps Script / CORS)');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = useMemo<TransactionStats>(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'in') acc.totalIn += curr.amount;
        else acc.totalOut += curr.amount;
        acc.balance = acc.totalIn - acc.totalOut;
        return acc;
      },
      { totalIn: 0, totalOut: 0, balance: 0 }
    );
  }, [transactions]);

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    try {
      // Mapping ke body sesuai doPost Apps Script: {nama, nominal, jumlah}
      const payload = {
        nama: t.title,
        nominal: t.amount,
        jumlah: t.type === 'in' ? 'Masuk' : 'Keluar',
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        // Jika dev mode via proxy, kita bisa pakai JSON + cors
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify(payload),
      });

      toast.success('Transaksi berhasil dicatat!');
      
      // Update lokal dulu agar cepat
      const newLocal = { ...t, id: crypto.randomUUID() };
      setTransactions((prev) => [newLocal, ...prev]);
      
      // Refetch setelah 2 detik untuk memastikan data masuk ke server
      setTimeout(fetchTransactions, 2000);
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Gagal menyimpan ke Google Sheets');
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.info('Dihapus lokal (Script tidak mendukung hapus)');
  };

  return { transactions, stats, addTransaction, deleteTransaction, isLoading, refresh: fetchTransactions };
};
