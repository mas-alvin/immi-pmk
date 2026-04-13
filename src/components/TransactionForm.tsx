import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import type { TransactionType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionFormProps {
  onAdd: (t: { title: string; amount: number; type: TransactionType; date: string; category: string }) => void;
  isLoading?: boolean;
}

export const TransactionForm = ({ onAdd, isLoading }: TransactionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('');
  const [jumlahType, setJumlahType] = useState<TransactionType>('in');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nominal) return;

    await onAdd({
      title: nama,
      amount: Number(nominal),
      type: jumlahType,
      date: new Date().toISOString(),
      category: 'Umum',
    });

    setNama('');
    setNominal('');
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={24} />
          <span className="font-bold">Catat Transaksi</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Input Data Kas</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setJumlahType('in')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      jumlahType === 'in' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setJumlahType('out')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      jumlahType === 'out' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Keluar
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Nama</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama transaksi..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Nominal (IDR)</label>
                  <input
                    type="number"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Jumlah (Keterangan)</span>
                  <span className={`text-sm font-bold ${jumlahType === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {jumlahType === 'in' ? 'Masuk (+)' : 'Keluar (-)'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 mt-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Transaksi'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
