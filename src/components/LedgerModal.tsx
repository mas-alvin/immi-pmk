import { useState } from 'react';
import { X, Loader2, Save, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LedgerModalProps {
  onAdd: (data: { tanggal: string, masuk: number, keluar: number, ket: string }) => void;
  isLoading?: boolean;
}

export const LedgerModal = ({ onAdd, isLoading }: LedgerModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'masuk' | 'keluar'>('masuk');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominal || !keterangan) return;

    await onAdd({
      tanggal,
      masuk: type === 'masuk' ? Number(nominal) : 0,
      keluar: type === 'keluar' ? Number(nominal) : 0,
      ket: keterangan
    });

    setNominal('');
    setKeterangan('');
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group font-black uppercase tracking-widest text-sm"
        >
          Input Catatan Baru
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-lg p-10 shadow-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Catatan Keuangan</h3>
                  <p className="text-sm text-slate-400 font-medium tracking-tight">Tambah pemasukan atau pengeluaran umum</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="bg-slate-50 p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType('masuk')}
                    className={`p-4 rounded-lg flex items-center justify-center gap-2 font-black transition-all ${type === 'masuk' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400'}`}
                  >
                    <ArrowDownLeft size={20} /> PEMASUKAN
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('keluar')}
                    className={`p-4 rounded-lg flex items-center justify-center gap-2 font-black transition-all ${type === 'keluar' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 text-slate-400'}`}
                  >
                    <ArrowUpRight size={20} /> PENGELUARAN
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nominal</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">Rp</span>
                    <input
                      type="number"
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-black text-slate-800 text-xl"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Keterangan</label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 min-h-[100px]"
                    placeholder="Contoh: Beli konsumsi rapat"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-5 text-white rounded-lg font-black text-lg shadow-xl transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70 ${type === 'masuk' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-rose-600 shadow-rose-200'}`}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  SIMPAN CATATAN
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
