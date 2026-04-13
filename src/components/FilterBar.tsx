import { Calendar } from 'lucide-react';

interface FilterBarProps {
  bulan: string;
  tahun: string;
  onBulanChange: (b: string) => void;
  onTahunChange: (t: string) => void;
}

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const TAHUN_LIST = ['2024', '2025', '2026', '2027'];

export const FilterBar = ({ bulan, tahun, onBulanChange, onTahunChange }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-lg">
      <div className="flex items-center gap-2 text-slate-400 px-2 group">
        <Calendar size={18} className="group-hover:text-indigo-600 transition-colors" />
        <span className="font-black text-[10px] uppercase tracking-[0.2em] select-none">Periode</span>
      </div>

      <div className="flex gap-2">
        <select
          value={bulan}
          onChange={(e) => onBulanChange(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-black uppercase tracking-wider text-slate-700 appearance-none cursor-pointer"
        >
          {BULAN_LIST.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={tahun}
          onChange={(e) => onTahunChange(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-black uppercase tracking-wider text-slate-700 appearance-none cursor-pointer"
        >
          {TAHUN_LIST.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
