import { useState, useEffect, useMemo } from 'react';
import type { MemberPayment, MonthlyStats } from '../types/index';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const useMemberPayments = (bulan: string, tahun: string) => {
  const [payments, setPayments] = useState<MemberPayment[]>([]);
  const [memberList, setMemberList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('bulan', bulan);
      url.searchParams.append('tahun', tahun);

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        // Jangan tampilkan toast error jika hanya karena sheet belum ada, 
        // karena script akan otomatis membuatnya saat input pertama.
        setPayments([]);
        setMemberList(data.memberList || []);
        return;
      }
      
      setPayments(data.payments || []);
      setMemberList(data.memberList || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Gagal memuat data iuran');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [bulan, tahun]);

  // Statistik iuran bulanan
  const stats = useMemo<MonthlyStats>(() => {
    return payments.reduce(
      (acc, curr) => {
        const v1 = Number(curr.v1 || 0);
        const v2 = Number(curr.v2 || 0);
        if (curr.m1 === 'online') acc.totalOnline += v1;
        else if (curr.m1 === 'offline') acc.totalOffline += v1;
        if (curr.m2 === 'online') acc.totalOnline += v2;
        else if (curr.m2 === 'offline') acc.totalOffline += v2;
        acc.totalKas = acc.totalOnline + acc.totalOffline;
        return acc;
      },
      { totalOnline: 0, totalOffline: 0, totalKas: 0 }
    );
  }, [payments]);

  const addPayment = async (data: any) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ ...data, action: 'addIuran' }),
      });
      toast.success('Setoran iuran berhasil disimpan!');
      setTimeout(fetchPayments, 1500); 
    } catch (error) {
      toast.error('Gagal mengirim iuran');
    } finally {
      setIsLoading(false);
    }
  };

  return { payments, memberList, stats, addPayment, isLoading };
};
