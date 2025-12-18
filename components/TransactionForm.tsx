
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';

interface TransactionFormProps {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate: (transaction: Transaction) => void;
  initialData?: Transaction | null;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onUpdate, initialData, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: CATEGORIES.expense[0],
    type: 'expense',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        amount: initialData.amount,
        category: initialData.category,
        type: initialData.type,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return;
    
    if (initialData) {
      onUpdate({ ...formData, id: initialData.id });
    } else {
      onSave(formData);
    }
  };

  const handleTypeChange = useCallback((type: TransactionType) => {
    setFormData(prev => ({ ...prev, type, category: CATEGORIES[type][0] }));
  }, []);

  const getTypeStyles = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600 border-emerald-100 bg-emerald-50/20 focus:ring-emerald-500/30';
      case 'expense':
        return 'text-rose-600 border-rose-100 bg-rose-50/20 focus:ring-rose-500/30';
      case 'savings':
        return 'text-indigo-600 border-indigo-100 bg-indigo-50/20 focus:ring-indigo-500/30';
      case 'loans':
        return 'text-amber-600 border-amber-100 bg-amber-50/20 focus:ring-amber-500/30';
      default:
        return 'text-slate-900 border-slate-200 bg-slate-50 focus:ring-indigo-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[100] animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.25)] w-full max-w-xl p-8 sm:p-14 overflow-hidden animate-in slide-in-from-bottom-6 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              {initialData ? 'Edit Entry' : 'New Entry'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Transaction Protocol Active</p>
          </div>
          <button 
            onClick={onCancel} 
            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type Selector Tabs */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl gap-1">
            {(['income', 'expense', 'savings', 'loans'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-3 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  formData.type === t ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Monetary Volume (₹)</label>
            <div className="relative">
               <input
                type="number"
                required
                autoFocus
                min="0.01"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-8 py-8 rounded-[2rem] border-2 focus:ring-8 outline-none transition-all text-5xl font-black tracking-tighter text-center tabular-nums ${getTypeStyles(formData.type)}`}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Calendar Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Categorization</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  {CATEGORIES[formData.type].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              {formData.type === 'loans' ? 'Financial Counterparty' : 'Transaction Context'}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all"
              placeholder={formData.type === 'loans' ? "Entity or Issuer name..." : "Describe the movement..."}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="order-2 sm:order-1 flex-1 py-5 px-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all"
            >
              Cancel Update
            </button>
            <button
              type="submit"
              className="order-1 sm:order-2 flex-[2] py-5 px-8 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-slate-800 shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={formData.amount <= 0}
            >
              {initialData ? 'Finalize Changes' : 'Execute Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
