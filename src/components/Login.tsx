import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

export const Login = ({ onLogin, isLoading }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!username || !password || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onLogin(username, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const busy = isLoading || isSubmitting;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Sisi Kiri: Branding/Visual */}
        <div className="w-full md:w-1/2 bg-indigo-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Dekorasi Abstract */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">AL-KAS IMMI</h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-extrabold leading-tight mb-4 text-indigo-50">
                Kelola Keuangan <br /> Lebih Terstruktur.
              </h1>
              <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                Platform manajemen keuangan eksklusif untuk mendukung efisiensi operasional pengurus IMMI.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-300 uppercase tracking-[0.2em]">
              <span className="w-8 h-[1px] bg-indigo-400"></span>
              Secure Infrastructure
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="w-full md:w-1/2 p-8 md:p-14 bg-white">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang</h3>
            <p className="text-slate-500 text-sm">Silakan masukkan kredensial anda untuk masuk.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_immi"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                  required
                  disabled={busy}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                  required
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {busy ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-[0.15em]">
                Immi Financial Management System &copy; 2024
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};