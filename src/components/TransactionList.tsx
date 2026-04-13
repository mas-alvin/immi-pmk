import { Trash2, Search, Filter, ArrowUpDown } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/ui';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, searchTerm, filterType]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 pb-20 md:pb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-xl font-bold text-slate-800">Riwayat Transaksi</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm w-full md:w-64"
            />
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            {(['all', 'in', 'out'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type === 'all' ? 'Semua' : type === 'in' ? 'Masuk' : 'Keluar'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider uppercase tracking-wider">Tanggal</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider uppercase tracking-wider">Nama</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider uppercase tracking-wider">Nominal</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider uppercase tracking-wider">Jumlah</th>
              <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {filteredTransactions.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan={5} className="text-center py-20">
                    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Filter className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-400 font-medium">Tidak ada transaksi ditemukan</p>
                  </td>
                </motion.tr>
              ) : (
                filteredTransactions.map((t) => (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-600">
                        {format(new Date(t.date), 'dd/MM/yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-slate-800">{t.title}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-bold ${t.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        t.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {t.type === 'in' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
