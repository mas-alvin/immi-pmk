import { Wallet, LogOut } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full mb-8">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-slate-200/50" />
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg text-white shadow-xl shadow-indigo-200 hover:rotate-6 transition-transform cursor-pointer group">
            <img src="/IMMI.png" alt="IMMI" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-1">
              KEUANGAN <span className="text-indigo-600">IMMI</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Internal Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Admin Panel</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Online
            </span>
          </div>
          <button className="bg-slate-100 p-3 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
