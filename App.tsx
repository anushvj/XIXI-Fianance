
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
      setAnalysisError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [transactions]);

  useEffect(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    
    if (transactions.length > 0) {
      analysisTimeoutRef.current = window.setTimeout(() => {
        handleRefreshInsights();
      }, 3000);
    }
    
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, [transactions, handleRefreshInsights]);

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...data, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  };

  const handleUpdateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    if (curr.type === 'income' || curr.type === 'loans') return acc + curr.amount;
    if (curr.type === 'expense' || curr.type === 'savings') return acc - curr.amount;
    return acc; 
  }, 0);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-100 flex flex-col font-['Inter']">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200/50">X</div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter">XIXI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Finance Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-sm font-semibold text-slate-900 border-b-2 border-indigo-600 pb-1">Overview</a>
              <a href="#" className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">Analytics</a>
              <a href="#" className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">Wealth</a>
            </nav>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Record</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 space-y-16">
        {/* Grand Balance Section */}
        <section className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">Net Worth Estimate</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-2">
                ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}<span className="text-4xl text-slate-500 font-medium">.{(totalBalance % 1).toFixed(2).split('.')[1]}</span>
              </h2>
              <div className="flex items-center gap-4 text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Active Wallet
                </span>
                <span className="text-slate-600">•</span>
                <span>Last Updated Today</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl min-w-[160px]">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Cash Inflow</p>
                <p className="text-2xl font-black text-emerald-400">↑ ₹{(transactions.filter(t => t.type === 'income' || t.type === 'loans').reduce((a, b) => a + b.amount, 0)).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl min-w-[160px]">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Spending</p>
                <p className="text-2xl font-black text-rose-400">↓ ₹{(transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0)).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <InsightPanel 
            insight={insight} 
            loading={isAnalyzing} 
            error={analysisError}
            onRefresh={handleRefreshInsights} 
          />
        </section>

        {/* Interactive Dashboard */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black tracking-tight">Market Analytics</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-100">Charts</button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-200 transition-colors">List View</button>
            </div>
          </div>
          <Dashboard transactions={transactions} />
        </section>

        {/* Ledger Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black tracking-tight">Financial Ledger</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{transactions.length} Total Entries</p>
          </div>
          <TransactionList 
            transactions={transactions} 
            onEdit={setEditingTransaction} 
            onDelete={handleDeleteTransaction}
          />
        </section>
      </main>

      <footer className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-400">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">X</div>
              <span className="text-slate-900 font-black tracking-tighter">XIXI FINANCE</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">A world-class suite for managing your liquid capital, debts, and savings with artificial intelligence.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-900 font-bold uppercase text-xs tracking-widest">Platform</h4>
            <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Security Architecture</a>
            <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Privacy Protocol</a>
            <a href="#" className="text-sm hover:text-indigo-600 transition-colors">API Reference</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-900 font-bold uppercase text-xs tracking-widest">Connect</h4>
            <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Customer Support</a>
            <a href="#" className="text-sm hover:text-indigo-600 transition-colors">Global Offices</a>
            <p className="text-[10px] mt-8">© 2025 XIXI FINANCE LTD. ALL RIGHTS RESERVED.</p>
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
