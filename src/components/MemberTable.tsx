import type { MemberPayment } from '../types';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface MemberTableProps {
  payments: MemberPayment[];
  isLoading: boolean;
  totalOnline: number;
  totalOffline: number;
  totalKas: number;
}

export const MemberTable = ({ payments, isLoading }: MemberTableProps) => {
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
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date);
    } catch {
      return '-';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-24 text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Sinkronisasi Cloud...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            {/* Main Header Group */}
            <tr>
              <th rowSpan={2} className="left-0 z-20 bg-slate-50 py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-r border-slate-100 text-center">NO</th>
              <th rowSpan={2} className="left-12 z-20 bg-slate-50 py-6 px-6 text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-r border-slate-100 min-w-[220px]">
                <div className="flex items-center gap-2"><User size={14} className="text-emerald-600"/> NAMA ANGGOTA</div>
              </th>
              <th colSpan={3} className="py-4 px-4 text-[10px] font-black text-emerald-700 uppercase tracking-widest border-b border-emerald-100 text-center bg-emerald-50/50">
                PEMBAYARAN 1 (AWAL)
              </th>
              <th colSpan={3} className="py-4 px-4 text-[10px] font-black text-blue-700 uppercase tracking-widest border-b border-blue-100 text-center bg-blue-50/50">
                PEMBAYARAN 2 (AKHIR)
              </th>
              <th rowSpan={2} className="py-6 px-4 text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 text-center bg-slate-100/50">
                TOTAL TABUNGAN
              </th>
            </tr>
            {/* Sub Header */}
            <tr className="bg-slate-50/80">
              <th className="py-3 px-2 text-[9px] font-bold text-slate-400 uppercase text-center border-b border-slate-100">Tanggal</th>
              <th className="py-3 px-2 text-[9px] font-bold text-slate-400 uppercase text-center border-b border-slate-100">Nominal</th>
              <th className="py-3 px-2 text-[9px] font-bold text-slate-400 uppercase text-center border-b border-emerald-100">Mode</th>
              <th className="py-3 px-2 text-[9px] font-bold text-slate-400 uppercase text-center border-b border-slate-100">Tanggal</th>
              <th className="py-3 px-2 text-[9px] font-bold text-slate-400 uppercase text-center border-b border-slate-100">Nominal</th>
              <th className="py-3 px-2 text-[9px] font-bold text-slate-400 uppercase text-center border-b border-blue-100">Mode</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {payments.map((m, idx) => {
              const totalPerPerson = Number(m.v1 || 0) + Number(m.v2 || 0);
              return (
                <motion.tr 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={idx} 
                  className="group hover:bg-emerald-50/30 transition-colors"
                >
                  <td className="left-0 z-10 bg-white group-hover:bg-gray-400/30 py-4 px-4 text-xs font-black text-slate-900 border-r border-slate-50 text-center">{m.no}</td>
                  <td className="left-12 z-10 bg-white group-hover:bg-gray-400/30 py-4 px-6 border-r border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{m.nama}</span>
                        {/* <span className="text-[9px] text-slate-400 font-medium">ANGGOTA AKTIF</span> */}
                    </div>
                  </td>
                  
                  {/* Termin 1 */}
                  <td className="py-4 px-2 text-center group-hover:bg-gray-400/30 text-[11px] font-bold text-slate-400 italic">{formatDate(m.t1)}</td>
                  <td className="py-4 px-2 text-center group-hover:bg-gray-400/30 text-xs font-black text-emerald-600 bg-emerald-50/20">
                    {m.v1 > 0 ? formatCurrency(m.v1).replace('Rp', '') : '-'}
                  </td>
                  <td className="py-4 px-2 text-center group-hover:bg-gray-400/30">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${
                        m.m1 === 'online' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        m.m1 === 'offline' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'hidden'
                    }`}>
                      {m.m1}
                    </span>
                  </td>

                  {/* Termin 2 */}
                  <td className="py-4 px-2 text-center group-hover:bg-gray-400/30 text-[11px] font-bold text-slate-400 italic">{formatDate(m.t2)}</td>
                  <td className="py-4 px-2 text-center group-hover:bg-gray-400/30 text-xs font-black text-blue-600 bg-blue-50/20">
                    {m.v2 > 0 ? formatCurrency(m.v2).replace('Rp', '') : '-'}
                  </td>
                  <td className="py-4 px-2 text-center group-hover:bg-gray-400/30">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${
                        m.m2 === 'online' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        m.m2 === 'offline' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'hidden'
                    }`}>
                      {m.m2}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 text-center bg-slate-50/50 group-hover:bg-emerald-600 group-hover:text-white">
                    <div className="flex items-center justify-center gap-1 font-black text-sm tracking-tighter">
                        {totalPerPerson > 0 ? formatCurrency(totalPerPerson) : '-'}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>

          {/* New Modern Footer */}
          {/* <tfoot>
            <tr className="bg-slate-900">
                <td colSpan={2} className="p-8 left-0 z-20 bg-slate-900 border-t border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
                            <CreditCard className="text-emerald-400" size={24}/>
                        </div>
                        <div>
                            <h4 className="text-white font-black text-sm tracking-widest uppercase">Ringkasan Kas</h4>
                            <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em]">UPDATED LIVE</p>
                        </div>
                    </div>
                </td>
                <td colSpan={2} className="p-8 border-t border-slate-800">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 text-center">Transfer Online</p>
                    <p className="text-blue-400 font-black text-lg text-center">{formatCurrency(totalOnline)}</p>
                </td>
                <td colSpan={2} className="p-8 border-t border-slate-800">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 text-center">Setoran Tunai</p>
                    <p className="text-amber-400 font-black text-lg text-center">{formatCurrency(totalOffline)}</p>
                </td>
                <td colSpan={3} className="p-8 border-t border-emerald-500 bg-emerald-600">
                    <p className="text-emerald-100 text-[9px] font-black uppercase tracking-widest mb-1 text-center">Grand Total Saldo</p>
                    <p className="text-white font-black text-2xl text-center tracking-tighter shadow-emerald-900">{formatCurrency(totalKas)}</p>
                </td>
            </tr>
          </tfoot> */}
        </table>
      </div>
    </div>
  );
};