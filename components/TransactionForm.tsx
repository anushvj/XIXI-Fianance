
import React, { useState, useEffect } from 'react';
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
    if (initialData) {
      onUpdate({ ...formData, id: initialData.id });
    } else {
      onSave(formData);
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData({ ...formData, type, category: CATEGORIES[type][0] });
  };

  const getTypeStyles = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600 border-emerald-100 bg-emerald-50/20 focus:ring-emerald-500';
      case 'expense':
        return 'text-rose-600 border-rose-100 bg-rose-50/20 focus:ring-rose-500';
      case 'savings':
        return 'text-indigo-600 border-indigo-100 bg-indigo-50/20 focus:ring-indigo-500';
      case 'loans':
        return 'text-amber-600 border-amber-100 bg-amber-50/20 focus:ring-amber-500';
      default:
        return 'text-slate-900 border-slate-200 bg-slate-50 focus:ring-indigo-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.3)] w-full max-w-xl p-10 md:p-14 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Modify Record' : 'Create Entry'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ledger Update Protocol v2.5</p>
          </div>
          <button onClick={onCancel} className="text-slate-300 hover:text-slate-600 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Type Selector Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
            {(['income', 'expense', 'savings', 'loans'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-3 px-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  formData.type === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Large Amount Input */}
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
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className={`w-full px-8 py-8 rounded-[2rem] border-2 focus:ring-4 outline-none transition-all text-5xl font-black tracking-tighter text-center ${getTypeStyles(formData.type)}`}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Calendar Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Classification</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all appearance-none"
              >
                {CATEGORIES[formData.type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              {formData.type === 'loans' ? 'Authorized Issuer' : 'Memo / Context'}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all"
              placeholder={formData.type === 'loans' ? "Entity providing credit..." : "Context for this transaction..."}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-5 px-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 px-8 bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {initialData ? 'Update Ledger' : 'Commit to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
