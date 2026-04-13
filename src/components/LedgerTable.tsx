import type { LedgerEntry } from '../types';
import { motion } from 'framer-motion';

interface LedgerTableProps {
  entries: LedgerEntry[];
  isLoading: boolean;
}

export const LedgerTable = ({ entries, isLoading }: LedgerTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Catatan...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th colSpan={6} className="py-6 text-center text-xl font-black text-amber-900 border-b border-amber-100 uppercase tracking-tighter">
                Catatan Keuangan IMMI
              </th>
            </tr>
            <tr className="bg-indigo-50/50">
              <th className="py-5 px-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest border border-indigo-100 select-none">Tanggal</th>
              <th className="py-5 px-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest border border-indigo-100 select-none">Saldo</th>
              <th className="py-5 px-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest border border-indigo-100 select-none">Pemasukan</th>
              <th className="py-5 px-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest border border-indigo-100 select-none">Pengeluaran</th>
              <th className="py-5 px-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest border border-indigo-100 select-none">Sisa Saldo</th>
              <th className="py-5 px-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest border border-indigo-100 select-none">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center text-slate-400 font-bold italic">Belum ada catatan transaksi</td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-4 px-4 border border-slate-100 text-sm font-bold text-slate-700 whitespace-nowrap">
                    {formatDate(entry.tanggal)}
                  </td>
                  <td className="py-4 px-4 border border-slate-100 text-sm font-bold text-slate-400">
                    {entry.saldo > 0 ? formatCurrency(entry.saldo) : ''}
                  </td>
                  <td className="py-4 px-4 border border-slate-100 text-sm font-black text-emerald-600">
                    {entry.masuk > 0 ? `+ ${formatCurrency(entry.masuk)}` : ''}
                  </td>
                  <td className="py-4 px-4 border border-slate-100 text-sm font-black text-rose-600">
                    {entry.keluar > 0 ? `- ${formatCurrency(entry.keluar)}` : ''}
                  </td>
                  <td className="py-4 px-4 border border-slate-100 text-sm font-black text-indigo-700 bg-indigo-50/20">
                    {formatCurrency(entry.sisa)}
                  </td>
                  <td className="py-4 px-4 border border-slate-100 text-sm font-medium text-slate-600">
                    {entry.ket}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
