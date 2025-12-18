

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const totals = transactions.reduce((acc, curr) => {
      acc[curr.type] += curr.amount;
      return acc;
    }, { income: 0, expense: 0, savings: 0, loans: 0 });

    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

    // Explicitly cast value as number to resolve arithmetic operation type errors
    const pieData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);

    const monthlyData: Record<string, { month: string; income: number; expense: number; savings: number; loans: number }> = {};
    const recentMonths = Array.from({length: 6}, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    recentMonths.forEach(m => {
      monthlyData[m] = { month: m, income: 0, expense: 0, savings: 0, loans: 0 };
    });

    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (monthlyData[month]) {
        monthlyData[month][t.type] += t.amount;
      }
    });

    return { totals, pieData, barData: Object.values(monthlyData) };
  }, [transactions]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Stream</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Capital flow dynamics</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Inbound</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Outbound</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData} barGap={6}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  fontWeight={800}
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  fontWeight={800}
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', padding: '16px', boxShadow: '0 20px 40px -8px rgb(0 0 0 / 0.1)', background: 'white' }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px', padding: '2px 0' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                />
                <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={true} animationDuration={800} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={true} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Pie Chart */}
        <div className="bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full transition-transform duration-1000 group-hover:scale-150"></div>
          <h3 className="text-xl font-black mb-1 relative z-10">Asset Allocation</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 relative z-10">Sector distribution</p>
          <div className="h-60 relative z-10">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff', fontSize: '11px' }}
                     itemStyle={{ color: '#fff', fontWeight: 800, padding: 0 }}
                     formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-700">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-dashed mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting sector data</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Expenses</p>
                <p className="text-xl font-black tabular-nums">₹{stats.totals.expense.toLocaleString('en-IN', { maximumSignificantDigits: 3 })}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2 relative z-10">
             {stats.pieData.slice(0, 3).map((item, idx) => (
               <div key={idx} className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                 <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
