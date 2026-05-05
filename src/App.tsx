import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { SummaryCards } from './components/SummaryCards';
import { MemberTable } from './components/MemberTable';
import { PaymentModal } from './components/PaymentModal';
import { LedgerTable } from './components/LedgerTable';
import { LedgerModal } from './components/LedgerModal';
import { BisnisDashboard } from './components/bisnis/BisnisDashboard';
import { SellerModule } from './components/bisnis/SellerModule';
import { BarangModule } from './components/bisnis/BarangModule';
import { DompetBisnisModule } from './components/bisnis/DompetBisnisModule';
import { TransaksiModule } from './components/bisnis/TransaksiModule';
import { Login } from './components/Login';
import { useMemberPayments } from './hooks/useMemberPayments';
import { useLedger } from './hooks/useLedger';
import { useAuth } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const getCurrentMonth = () => {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date());
};

type PageID = 'dashboard' | 'iuran' | 'catatan' | 'seller' | 'barang' | 'dompet' | 'transaksi';

function App() {
  const { user, isAuthenticated, isLoading: isAuthLoading, login, logout } = useAuth();
  
  const [activePage, setActivePage] = useState<PageID>(() => {
    return (localStorage.getItem('immi_active_page') as PageID) || 'dashboard';
  });

  const handlePageChange = (page: PageID) => {
    setActivePage(page);
    localStorage.setItem('immi_active_page', page);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bulan, setBulan] = useState(getCurrentMonth());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  
  const { payments, memberList, stats, addPayment, isLoading: isIuranLoading } = useMemberPayments(bulan, tahun);
  const { entries, stats: ledgerStats, addEntry, isLoading: isLedgerLoading, refresh: refreshLedger } = useLedger();

  const handleAddPayment = async (data: any) => {
    await addPayment(data);
    setTimeout(refreshLedger, 1600);
  };

  const memberNames = useMemo(() => {
    return memberList.length > 0 ? memberList : payments.map(p => p.nama).sort();
  }, [memberList, payments]);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard Overview';
      case 'iuran': return 'Laporan Iuran Kas';
      case 'catatan': return 'Buku Catatan Utama';
      case 'seller': return 'Manajemen Seller';
      case 'barang': return 'Inventaris Barang';
      case 'dompet': return 'Dompet Bisnis';
      case 'transaksi': return 'Transaksi Baru';
      default: return 'Overview';
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={login} isLoading={isAuthLoading} />
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
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Navigation Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={handlePageChange} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header 
          onLogout={logout} 
          user={user} 
          onMenuClick={() => setIsSidebarOpen(true)}
          title={getPageTitle()}
        />
        
        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="container mx-auto pb-24">
            
            <AnimatePresence mode="wait">
              {activePage === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <BisnisDashboard onNavigateToDompet={() => handlePageChange('dompet')} />
                </motion.div>
              )}

              {activePage === 'iuran' && (
                <motion.div key="iuran" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <SummaryCards total1={stats.totalOnline} total2={stats.totalOffline} total3={stats.totalKas} isLoading={isIuranLoading} mode="iuran" />
                  <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                      <FilterBar bulan={bulan} tahun={tahun} onBulanChange={setBulan} onTahunChange={setTahun} />
                    </div>
                    <div className="bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-100">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Status Laporan</span>
                      <span className="text-sm font-black text-indigo-700 uppercase">{bulan} {tahun}</span>
                    </div>
                  </div>
                  <MemberTable payments={payments} isLoading={isIuranLoading} totalOnline={stats.totalOnline} totalOffline={stats.totalOffline} totalKas={stats.totalKas} />
                  <PaymentModal memberNames={memberNames} onAdd={handleAddPayment} isLoading={isIuranLoading} currentBulan={bulan} currentTahun={tahun} />
                </motion.div>
              )}

              {activePage === 'catatan' && (
                <motion.div key="catatan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <SummaryCards total1={ledgerStats.totalMasuk} total2={ledgerStats.totalKeluar} total3={ledgerStats.saldoAkhir} isLoading={isLedgerLoading} mode="catatan" />
                  <div className="mb-6 flex items-center justify-between">
                    <div className="bg-amber-50 px-6 py-4 rounded-xl border border-amber-100">
                      <h2 className="text-lg font-black text-amber-900 leading-none mb-1 uppercase tracking-tighter italic">Ledger Utama</h2>
                      <p className="text-xs font-bold text-amber-600/80">Monitor Pemasukan & Pengeluaran Organisasi</p>
                    </div>
                  </div>
                  <LedgerTable entries={entries} isLoading={isLedgerLoading} />
                  <LedgerModal onAdd={addEntry} isLoading={isLedgerLoading} />
                </motion.div>
              )}

              {activePage === 'seller' && (
                <motion.div key="seller" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SellerModule />
                </motion.div>
              )}

              {activePage === 'barang' && (
                <motion.div key="barang" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <BarangModule />
                </motion.div>
              )}

              {activePage === 'dompet' && (
                <motion.div key="dompet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <DompetBisnisModule />
                </motion.div>
              )}

              {activePage === 'transaksi' && (
                <motion.div key="transaksi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <TransaksiModule />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

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
