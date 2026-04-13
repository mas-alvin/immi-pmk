import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  totalOnline: number;
  totalOffline: number;
  totalKas: number;
  isLoading: boolean;
}

export const SummaryCards = ({ totalOnline, totalOffline, totalKas, isLoading }: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Setoran Online',
      amount: totalOnline,
      icon: ArrowUpRight,
      color: 'bg-blue-600',
      shadow: 'shadow-blue-200',
      textColor: 'text-blue-600'
    },
    {
      title: 'Setoran Offline',
      amount: totalOffline,
      icon: ArrowDownRight,
      color: 'bg-amber-600',
      shadow: 'shadow-amber-200',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Saldo Kas',
      amount: totalKas,
      icon: Wallet,
      color: 'bg-emerald-600',
      shadow: 'shadow-emerald-200',
      textColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((card, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          key={idx}
          className="bg-white p-8 rounded-lg shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden group hover:translate-y-[-5px] transition-all"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-[0.03] rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform`} />
          
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.color} p-4 rounded-lg text-white shadow-lg ${card.shadow}`}>
              <card.icon size={28} />
            </div>
            {isLoading ? (
              <div className="animate-pulse bg-slate-100 h-8 w-24 rounded-lg" />
            ) : (
                <div className="flex items-center gap-2 text-emerald-500 font-black text-xs bg-emerald-50 px-3 py-1 rounded-lg">
                  <TrendingUp size={14} /> LIVE
                </div>
            )}
          </div>
          
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.title}</p>
            <h3 className={`text-2xl font-black ${card.textColor} tracking-tighter`}>
              {isLoading ? '...' : formatCurrency(card.amount)}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
