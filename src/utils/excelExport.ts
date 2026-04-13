import * as XLSX from 'xlsx';
import type { Transaction } from '../types';
import { format } from 'date-fns';

export const exportToExcel = (transactions: Transaction[]) => {
  const data = transactions.map((t) => ({
    Tanggal: format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
    Judul: t.title,
    Kategori: t.category,
    Tipe: t.type === 'in' ? 'Masuk' : 'Keluar',
    Nominal: t.amount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Kas');

  // Fix column widths
  const wscols = [
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `Laporan_Kas_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
};
