import { useState } from 'react';
import { Plus, X, Loader2, Send, Calendar } from 'lucide-react';
import type { PaymentMethod } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Combobox } from './Combobox';

interface PaymentModalProps {
  memberNames: string[];
  onAdd: (data: { 
    nama: string; 
    nominal: number; 
    metode: string; 
    termin: string;
    bulan: string;
    tahun: string;
    tanggal: string;
  }) => void;
  isLoading?: boolean;
  currentBulan: string;
  currentTahun: string;
}

export const PaymentModal = ({ memberNames, onAdd, isLoading, currentBulan, currentTahun }: PaymentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('10000');
  const [metode, setMetode] = useState<PaymentMethod>('online');
  const [termin, setTermin] = useState('1');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nominal) return;

    await onAdd({
      nama,
      nominal: Number(nominal),
      metode,
      termin,
      bulan: currentBulan,
      tahun: currentTahun,
      tanggal
    });

    setNama('');
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-lg bg-emerald-600 text-white shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          <span className="font-black uppercase tracking-widest text-sm">Input Iuran</span>
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
                  <h3 className="text-2xl font-black text-slate-900">Pembayaran Kas</h3>
                  <p className="text-sm text-slate-400 font-medium">Periode {currentBulan} {currentTahun}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="bg-slate-50 p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Anggota</label>
                  <Combobox 
                    options={memberNames}
                    value={nama}
                    onChange={setNama}
                    placeholder="Pilih nama anggota..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Tanggal</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Termin</label>
                    <select
                      value={termin}
                      onChange={(e) => setTermin(e.target.value)}
                      className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 appearance-none"
                    >
                      <option value="1">Awal Bulan</option>
                      <option value="2">Akhir Bulan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Metode</label>
                    <select
                      value={metode}
                      onChange={(e) => setMetode(e.target.value as PaymentMethod)}
                      className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 appearance-none"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nominal</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">Rp</span>
                      <input
                        type="number"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-black text-slate-800 text-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-emerald-600 text-white rounded-lg font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  SIMPAN PEMBAYARAN
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
