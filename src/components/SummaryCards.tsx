import { ArrowUpCircle, ArrowDownCircle, Scale } from 'lucide-react';
import type { TransactionStats } from '../types';
import { formatCurrency } from '../utils/ui';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  stats: TransactionStats;
}

export const SummaryCards = ({ stats }: SummaryCardsProps) => {
  const cards = [
    {
      label: 'Total Pemasukan',
      value: stats.totalIn,
      icon: ArrowUpCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Total Pengeluaran',
      value: stats.totalOut,
      icon: ArrowDownCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      label: 'Saldo Akhir',
      value: stats.balance,
      icon: Scale,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-6 rounded-2xl border ${card.border} ${card.bg} shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">{card.label}</span>
            <card.icon className={card.color} size={24} />
          </div>
          <div className={`text-2xl font-bold ${card.color}`}>
            {formatCurrency(card.value)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
