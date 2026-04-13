import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { useTransactions } from './hooks/useTransactions';
import { motion } from 'framer-motion';

function App() {
  const { transactions, stats, addTransaction, deleteTransaction, isLoading } = useTransactions();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      <Header transactions={transactions} />
      
      <main className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <p className="text-slate-500 font-medium mb-1">Selamat Datang di AlKas 👋</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Kelola Kas Jadi Lebih{" "}
                <span className="text-primary-600">Mudah.</span>
              </h2>
            </div>
          </div>
        </motion.div>

        <SummaryCards stats={stats} />
        
        {isLoading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse">
            <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-slate-100 rounded-full mb-2"></div>
            <div className="h-3 w-32 bg-slate-50 rounded-full"></div>
          </div>
        ) : (
          <TransactionList 
            transactions={transactions} 
            onDelete={deleteTransaction} 
          />
        )}

        <TransactionForm onAdd={addTransaction} isLoading={isLoading} />
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© 2026 AlKas - Aplikasi Pencatatan Kas Modern</p>
      </footer>
    </div>
  );
}

export default App;
