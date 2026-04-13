import { Wallet, Download } from 'lucide-react';
import { exportToExcel } from '../utils/excelExport';
import type { Transaction } from '../types';

interface HeaderProps {
  transactions: Transaction[];
}

export const Header = ({ transactions }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full glass mb-8">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            AlKas
          </h1>
        </div>
        
        <button
          onClick={() => exportToExcel(transactions)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm shadow-sm"
        >
          <Download size={18} />
          Export Excel
        </button>
      </div>
    </header>
  );
};
