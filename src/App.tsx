import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SummaryCards } from './components/SummaryCards';
import { MemberTable } from './components/MemberTable';
import { PaymentModal } from './components/PaymentModal';
import { LedgerTable } from './components/LedgerTable';
import { LedgerModal } from './components/LedgerModal';
import { useMemberPayments } from './hooks/useMemberPayments';
import { useLedger } from './hooks/useLedger';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen } from 'lucide-react';

const getCurrentMonth = () => {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date());
};

function App() {
  const [activeTab, setActiveTab] = useState<'iuran' | 'catatan'>('iuran');
  const [bulan, setBulan] = useState(getCurrentMonth());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  
  const { payments, memberList, stats, addPayment, isLoading: isIuranLoading } = useMemberPayments(bulan, tahun);
  const { entries, stats: ledgerStats, addEntry, isLoading: isLedgerLoading } = useLedger();

  const memberNames = useMemo(() => {
    return memberList.length > 0 ? memberList : payments.map(p => p.nama).sort();
  }, [memberList, payments]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 pb-24">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-1">
            <button
              onClick={() => setActiveTab('iuran')}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'iuran' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users size={18} /> Laporan Iuran
            </button>
            <button
              onClick={() => setActiveTab('catatan')}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'catatan' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen size={18} /> Buku Catatan
            </button>
          </div>
        </div>

        <SummaryCards 
          totalOnline={activeTab === 'iuran' ? stats.totalOnline : ledgerStats.totalMasuk}
          totalOffline={activeTab === 'iuran' ? stats.totalOffline : ledgerStats.totalKeluar}
          totalKas={activeTab === 'iuran' ? stats.totalKas : ledgerStats.saldoAkhir}
          isLoading={activeTab === 'iuran' ? isIuranLoading : isLedgerLoading}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'iuran' ? (
            <motion.div
              key="iuran"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                  <FilterBar 
                    bulan={bulan} 
                    tahun={tahun} 
                    onBulanChange={setBulan} 
                    onTahunChange={setTahun} 
                  />
                </div>
                <div className="bg-indigo-50 px-6 py-3 rounded-lg border border-indigo-100">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Status Laporan</span>
                  <span className="text-sm font-black text-indigo-700 uppercase">{bulan} {tahun}</span>
                </div>
              </div>

              <MemberTable 
                payments={payments} 
                isLoading={isIuranLoading}
                totalOnline={stats.totalOnline}
                totalOffline={stats.totalOffline}
                totalKas={stats.totalKas}
              />
              
              <PaymentModal 
                memberNames={memberNames} 
                onAdd={addPayment} 
                isLoading={isIuranLoading}
                currentBulan={bulan}
                currentTahun={tahun}
              />
            </motion.div>
          ) : (
            <motion.div
              key="catatan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="bg-amber-50 px-6 py-4 rounded-lg border border-amber-100">
                  <h2 className="text-lg font-black text-amber-900 leading-none mb-1 uppercase tracking-tighter italic">Ledger Utama</h2>
                  <p className="text-xs font-bold text-amber-600/80">Monitor Pemasukan & Pengeluaran Organisasi</p>
                </div>
              </div>

              <LedgerTable 
                entries={entries} 
                isLoading={isLedgerLoading} 
              />
              
              <LedgerModal 
                onAdd={addEntry} 
                isLoading={isLedgerLoading} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '12px', borderRadius: '8px' }}
      />
    </div>
  );
}

export default App;
