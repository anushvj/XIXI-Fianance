
import React from 'react';
import { FinancialInsight } from '../types.ts';

interface InsightPanelProps {
  insight: FinancialInsight | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insight, loading, error, onRefresh }) => {
  return (
    <div className="relative group overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-1 shadow-[0_32px_64px_-24px_rgba(79,70,229,0.3)]">
      <div className="relative bg-[#0F1117]/60 backdrop-blur-3xl rounded-[2.9rem] p-8 md:p-12 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/50">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Xixi Financial Mind</h3>
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Deep Granular Analysis Enabled</p>
              </div>
            </div>
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all text-white font-black text-xs border border-white/10 disabled:opacity-50 flex items-center gap-2 group/btn"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'CALCULATING...' : 'REFRESH INTEL'}
            </button>
          </div>

          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-6 bg-white/10 rounded-full w-3/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-24 bg-white/5 rounded-[1.5rem]"></div>
                <div className="h-24 bg-white/5 rounded-[1.5rem]"></div>
                <div className="h-24 bg-white/5 rounded-[1.5rem]"></div>
                <div className="h-24 bg-white/5 rounded-[1.5rem]"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 p-10 rounded-[2rem] text-center">
              <p className="text-rose-200 font-black tracking-widest uppercase text-xs mb-4">Core Analysis Fault</p>
              <p className="text-rose-100/60 text-sm mb-6">{error}</p>
              <button 
                onClick={onRefresh}
                className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition-colors"
              >
                Retry Analysis
              </button>
            </div>
          ) : insight ? (
            <div className="space-y-12">
              <div className="relative">
                <p className="text-xl md:text-3xl text-white font-medium leading-tight tracking-tight max-w-4xl">
                  {insight.summary}
                </p>
              </div>

              {/* Financial Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Debt/Income</p>
                  <p className="text-2xl font-black text-white">{(insight.metrics.debtToIncomeRatio * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Savings Rate</p>
                  <p className="text-2xl font-black text-emerald-400">{(insight.metrics.savingsRate * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Projected</p>
                  <p className="text-2xl font-black text-white">₹{insight.projectedSavings.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Risk Level</p>
                  <p className={`text-2xl font-black ${insight.warnings.length > 1 ? 'text-rose-400' : insight.warnings.length === 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {insight.warnings.length > 1 ? 'High' : insight.warnings.length === 1 ? 'Medium' : 'Low'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Category Analysis */}
                <div className="space-y-6">
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Category Deep Dive</h4>
                  <div className="space-y-3">
                    {insight.categoryAnalysis.map((item, idx) => (
                      <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-3xl border border-white/5 group/cat">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">{item.category}</span>
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        </div>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{item.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recurring Expenses */}
                <div className="space-y-6">
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Recurring Burn Rate</h4>
                  <div className="space-y-3">
                    {insight.recurringExpenses.length > 0 ? (
                      insight.recurringExpenses.map((exp, idx) => (
                        <div key={idx} className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-white font-black text-sm">{exp.description}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{exp.frequency}</p>
                          </div>
                          <p className="text-lg font-black text-rose-400">₹{exp.amount.toLocaleString('en-IN')}</p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white/5 p-10 rounded-3xl border border-white/5 text-center italic text-slate-500 text-sm">
                        No recurring patterns detected.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Strategic Directives */}
              <div className="bg-indigo-500/10 p-8 rounded-[2.5rem] border border-indigo-500/20">
                 <h4 className="text-indigo-300 font-black text-xs uppercase tracking-[0.3em] mb-6">Strategic Directives</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {insight.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed">{tip}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {insight.warnings.length > 0 && (
                <div className="bg-rose-500/10 p-6 rounded-[2rem] border border-rose-500/20 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Risk Exposure Warnings</span>
                    <p className="text-xs text-rose-100/70 font-bold mt-1 leading-relaxed">
                      {insight.warnings.join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-white font-black uppercase tracking-[0.3em] text-sm mb-2">Neural Link Initializing</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Upload your transaction ledger to activate the Xixi Financial Mind.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;
