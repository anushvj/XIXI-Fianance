
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Transaction, FinancialInsight } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import TransactionList from './components/TransactionList.tsx';
import TransactionForm from './components/TransactionForm.tsx';
import InsightPanel from './components/InsightPanel.tsx';
import { analyzeFinance } from './services/geminiService.ts';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('xixi_finance_data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [insight, setInsight] = useState<FinancialInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const analysisTimeoutRef = useRef<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('xixi_finance_data', JSON.stringify(transactions));
  }, [transactions]);

  const handleRefreshInsights = useCallback(async () => {
    if (transactions.length === 0) {
      setInsight(null);
      setAnalysisError(null);
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const result = await analyzeFinance(transactions);
      setInsight(result);
    } catch (err: any) {
      setAnalysisError(err.message || "Advisor currently unavailable.");
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [transactions]);

  // Debounced AI Analysis
  useEffect(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    
    if (transactions.length > 0) {
      // Faster debounce (1.5s) for better responsiveness
      analysisTimeoutRef.current = window.setTimeout(() => {
        handleRefreshInsights();
      }, 1500);
    }
    
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, [transactions, handleRefreshInsights]);

  const handleAddTransaction = useCallback((data: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...data, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  }, []);

  const handleUpdateTransaction = useCallback((updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingTransaction(null);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    if (confirm('Permanently remove this record from the ledger?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  }, []);

  // Memoized balance calculation to keep UI snappy
  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income' || curr.type === 'loans') return acc + curr.amount;
      if (curr.type === 'expense' || curr.type === 'savings') return acc - curr.amount;
      return acc; 
    }, 0);
  }, [transactions]);

  const inflow = useMemo(() => 
    transactions.filter(t => t.type === 'income' || t.type === 'loans').reduce((a, b) => a + b.amount, 0),
  [transactions]);

  const spending = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0),
  [transactions]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-100 flex flex-col font-['Inter'] antialiased">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200/40">X</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter">XIXI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Finance Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1">Overview</a>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Wealth</a>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Nodes</a>
            </nav>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 sm:px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add Record</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Grand Balance Section */}
        <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-16 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/50 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">Net Capital Profile</span>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter tabular-nums">
                ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}<span className="text-3xl sm:text-4xl text-slate-600 font-medium">.{(totalBalance % 1).toFixed(2).split('.')[1]}</span>
              </h2>
              <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Liquidity Active
                </span>
                <span className="text-slate-700">/</span>
                <span>SECURE_DATA_FEED_01</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex-1 min-w-[140px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Gross Inflow</p>
                <p className="text-2xl font-black text-emerald-400 tabular-nums">↑ {inflow.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex-1 min-w-[140px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Net Outflow</p>
                <p className="text-2xl font-black text-rose-400 tabular-nums">↓ {spending.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Section */}
        <section className="transition-opacity duration-500">
          <InsightPanel 
            insight={insight} 
            loading={isAnalyzing} 
            error={analysisError}
            onRefresh={handleRefreshInsights} 
          />
        </section>

        {/* Interactive Dashboard */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Portfolio Analytics</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global market distribution</p>
            </div>
            <div className="hidden sm:flex p-1 bg-slate-100 rounded-xl gap-1">
              <button className="px-4 py-2 rounded-lg bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-sm">Real-time</button>
              <button className="px-4 py-2 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Historical</button>
            </div>
          </div>
          <Dashboard transactions={transactions} />
        </section>

        {/* Ledger Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Financial Ledger</h3>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400">{transactions.length} Records</span>
            </div>
          </div>
          <TransactionList 
            transactions={transactions} 
            onEdit={setEditingTransaction} 
            onDelete={handleDeleteTransaction}
          />
        </section>
      </main>

      <footer className="py-20 bg-slate-50 border-t border-slate-100/60 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12 text-slate-400">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">X</div>
              <span className="text-slate-900 font-black tracking-tighter">XIXI FINANCE</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">Encrypted local-first architecture for the discerning capital manager. All data remains in your personal sandbox.</p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-[0.2em]">Framework</h4>
              <a href="#" className="text-xs font-bold hover:text-indigo-600 transition-colors">System Status</a>
              <a href="#" className="text-xs font-bold hover:text-indigo-600 transition-colors">Privacy Stack</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-[0.2em]">Contact</h4>
              <a href="#" className="text-xs font-bold hover:text-indigo-600 transition-colors">Support Portal</a>
              <p className="text-[10px] mt-4 font-black">© 2025 XIXI LTD.</p>
            </div>
          </div>
        </div>
      </footer>

      {(isFormOpen || editingTransaction) && (
        <TransactionForm
          initialData={editingTransaction}
          onSave={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
