
import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-xl font-black text-slate-900 mb-2">The ledger is currently empty</h4>
        <p className="text-slate-400 max-w-xs mx-auto">Your journey to financial excellence starts with your first entry. Click "Add Record" to begin.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden">
      <div className="divide-y divide-slate-50">
        {sortedTransactions.map((t) => (
          <div key={t.id} className="group flex items-center justify-between p-8 hover:bg-slate-50/50 transition-all cursor-default">
            <div className="flex items-center gap-6 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 
                t.type === 'expense' ? 'bg-rose-50 text-rose-600' : 
                t.type === 'savings' ? 'bg-indigo-50 text-indigo-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {t.type === 'income' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                ) : t.type === 'expense' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                ) : t.type === 'savings' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                )}
              </div>
              
              <div>
                <h4 className="font-black text-slate-900 tracking-tight leading-tight">{t.category}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px]">{t.description || 'No memo'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-right">
                <p className={`text-2xl font-black tracking-tighter ${
                  t.type === 'income' ? 'text-emerald-600' : 
                  t.type === 'expense' ? 'text-rose-600' : 
                  t.type === 'savings' ? 'text-indigo-600' :
                  'text-amber-600'
                }`}>
                  {(t.type === 'expense' || t.type === 'savings') ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{t.type}</p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button
                  onClick={() => onEdit(t)}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                  title="Edit Entry"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-lg transition-all"
                  title="Remove Entry"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
