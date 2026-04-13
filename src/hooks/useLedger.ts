import { useState, useEffect, useMemo } from 'react';
import type { LedgerEntry } from '../types/index';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const useLedger = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLedger = async () => {
    try {
      setIsLoading(true);
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('action', 'getCatatan');

      const response = await fetch(url.toString());
      const res = await response.json();
      
      if (res.error) {
        toast.error(`Error: ${res.error}`);
        return;
      }
      
      setEntries(res.data || []);
    } catch (error) {
      console.error('Error fetching ledger:', error);
      toast.error('Gagal mengambil data catatan kas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const stats = useMemo(() => {
    return entries.reduce((acc, curr) => {
      acc.totalMasuk += curr.masuk;
      acc.totalKeluar += curr.keluar;
      acc.saldoAkhir = curr.sisa;
      return acc;
    }, { totalMasuk: 0, totalKeluar: 0, saldoAkhir: 0 });
  }, [entries]);

  const addEntry = async (data: { tanggal: string, masuk: number, keluar: number, ket: string }) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ ...data, action: 'addCatatan' }),
      });

      toast.success('Catatan kas berhasil disimpan!');
      setTimeout(fetchLedger, 1500);
    } catch (error) {
      console.error('Error adding ledger entry:', error);
      toast.error('Gagal menyimpan catatan');
    } finally {
      setIsLoading(false);
    }
  };

  return { entries, stats, addEntry, isLoading, refresh: fetchLedger };
};
