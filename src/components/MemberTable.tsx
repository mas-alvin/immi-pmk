import type { MemberPayment } from '../types';
import { motion } from 'framer-motion';

interface MemberTableProps {
  payments: MemberPayment[];
  isLoading: boolean;
  totalOnline: number;
  totalOffline: number;
  totalKas: number;
}

export const MemberTable = ({ payments, isLoading, totalOnline, totalOffline, totalKas }: MemberTableProps) => {
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Singkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50/50">
              <th rowSpan={2} className="py-5 px-4 text-[10px] font-black text-emerald-900 uppercase tracking-widest border border-emerald-100 w-12 select-none">NO</th>
              <th rowSpan={2} className="py-5 px-6 text-[10px] font-black text-emerald-900 uppercase tracking-widest border border-emerald-100 min-w-[200px] select-none text-center">NAMA ANGGOTA</th>
              <th colSpan={3} className="py-3 px-4 text-[10px] font-black text-emerald-700 uppercase tracking-widest border border-emerald-100 text-center select-none bg-emerald-50">PEMBAYARAN 1 (Awal)</th>
              <th colSpan={3} className="py-3 px-4 text-[10px] font-black text-indigo-700 uppercase tracking-widest border border-indigo-100 text-center select-none bg-indigo-50">PEMBAYARAN 2 (Akhir)</th>
              <th rowSpan={2} className="py-5 px-4 text-[10px] font-black text-slate-900 uppercase tracking-widest border border-slate-200 text-center select-none bg-slate-50">TOTAL PER ORANG</th>
            </tr>
            <tr className="bg-slate-50/30">
              <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Tanggal</th>
              <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Nominal</th>
              <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Metode</th>
              <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Tanggal</th>
              <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Nominal</th>
              <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Metode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map((m, idx) => {
              const totalPerPerson = Number(m.v1 || 0) + Number(m.v2 || 0);
              return (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  key={idx} 
                  className="hover:bg-slate-50/80 transition-all group"
                >
                  <td className="py-4 px-4 border border-slate-100 text-xs font-black text-slate-300 group-hover:text-primary-600 transition-colors">{m.no}</td>
                  <td className="py-4 px-6 border border-slate-100 text-sm font-bold text-slate-700 group-hover:text-slate-900">{m.nama}</td>
                  
                  {/* Termin 1 */}
                  <td className="py-4 px-2 border border-slate-100 text-center text-[11px] font-bold text-slate-500">{formatDate(m.t1)}</td>
                  <td className="py-4 px-2 border border-slate-100 text-center text-xs font-black text-emerald-600 bg-emerald-50/10">
                    {m.v1 > 0 ? formatCurrency(m.v1).replace('Rp', '') : '-'}
                  </td>
                  <td className="py-4 px-2 border border-slate-100 text-center">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${m.m1 === 'online' ? 'bg-blue-100 text-blue-600' : m.m1 === 'offline' ? 'bg-amber-100 text-amber-600' : 'hidden'}`}>
                      {m.m1}
                    </span>
                  </td>

                  {/* Termin 2 */}
                  <td className="py-4 px-2 border border-slate-100 text-center text-[11px] font-bold text-slate-500">{formatDate(m.t2)}</td>
                  <td className="py-4 px-2 border border-slate-100 text-center text-xs font-black text-indigo-600 bg-indigo-50/10">
                    {m.v2 > 0 ? formatCurrency(m.v2).replace('Rp', '') : '-'}
                  </td>
                  <td className="py-4 px-2 border border-slate-100 text-center">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${m.m2 === 'online' ? 'bg-blue-100 text-blue-600' : m.m2 === 'offline' ? 'bg-amber-100 text-amber-600' : 'hidden'}`}>
                      {m.m2}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 border border-slate-100 text-center text-sm font-black text-slate-800 bg-slate-50/30">
                    {totalPerPerson > 0 ? formatCurrency(totalPerPerson) : '-'}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
          {/* Footer Summary */}
          <tfoot>
            <tr className="bg-slate-900 text-white font-black">
              <td colSpan={2} className="py-6 px-6 text-xs uppercase tracking-widest text-right">Rekap Bulanan :</td>
              <td colSpan={2} className="py-6 px-4 text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 mb-1">TOTAL ONLINE</div>
                <div className="text-sm text-blue-400">{formatCurrency(totalOnline)}</div>
              </td>
              <td colSpan={2} className="py-6 px-4 text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 mb-1">TOTAL OFFLINE</div>
                <div className="text-sm text-amber-400">{formatCurrency(totalOffline)}</div>
              </td>
              <td colSpan={3} className="py-6 px-4 text-center border-l border-slate-800 bg-primary-900/50">
                <div className="text-[10px] text-primary-300 mb-1">SALDO KAS MASUK</div>
                <div className="text-xl text-white">{formatCurrency(totalKas)}</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
