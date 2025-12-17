
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
      <div className="relative bg-[#0F1117]/60 backdrop-blur-2xl rounded-[2.9rem] p-8 md:p-12 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/50">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Xixi Intelligence</h3>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Real-time Financial Advisor</p>
              </div>
            </div>
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all text-white font-bold text-sm border border-white/5 disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Analyzing...' : 'Refresh AI'}
            </button>
          </div>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
              <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="h-32 bg-white/5 rounded-3xl"></div>
                <div className="h-32 bg-white/5 rounded-3xl"></div>
                <div className="h-32 bg-white/5 rounded-3xl"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center">
              <p className="text-rose-200 font-bold mb-4">Analysis Synapse Interrupted</p>
              <button 
                onClick={onRefresh}
                className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-700 transition-colors"
              >
                Reconnect Advisor
              </button>
            </div>
          ) : insight ? (
            <div className="space-y-10">
              <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-8">
                "{insight.summary}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-indigo-500/30 transition-all group/card">
                  <h4 className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Forecast</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">₹{insight.projectedSavings.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 text-sm font-bold mb-1">Target</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">Expected liquidity surplus by next cycle.</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 md:col-span-2 hover:border-indigo-500/30 transition-all">
                  <h4 className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Strategic Directives</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {insight.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3 group/tip">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/tip:bg-indigo-500 transition-colors">
                          <svg className="w-3 h-3 text-indigo-400 group-hover/tip:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {insight.warnings.length > 0 && (
                <div className="bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-black text-rose-400 uppercase tracking-widest">Alert Profile</span>
                    <p className="text-sm text-rose-200/80 font-medium mt-0.5">{insight.warnings.join(' • ')}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.674a1 1 0 00.922-.617l2.105-4.736a1 1 0 00-.922-1.647H14l.847-2.541a1 1 0 00-.948-1.474h-3.805a1 1 0 00-.916.591L7.047 11.2a1 1 0 00.916 1.8H9l-.847 2.541a1 1 0 00.948 1.474z" />
                </svg>
              </div>
              <p className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">Awaiting Data Streams</p>
              <p className="text-slate-600 text-sm">Add your financial records to initialize Xixi AI insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;
