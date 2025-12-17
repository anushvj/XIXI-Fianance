
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
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

    const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

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
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (monthlyData[month]) {
        monthlyData[month][t.type] += t.amount;
      }
    });

    const barData = Object.values(monthlyData);

    return { totals, pieData, barData };
  }, [transactions]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="space-y-12">
      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Velocity</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cash Flow Dynamics (Last 6 Months)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Inflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Outflow</span>
              </div>
            </div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData} barGap={8}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', padding: '16px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px', padding: '2px 0' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                />
                <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <h3 className="text-xl font-black mb-1 relative z-10">Capital Allocation</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-10 relative z-10">Expense Segmentation</p>
          <div className="h-64 relative z-10">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff', fontSize: '12px' }}
                     itemStyle={{ color: '#fff', fontWeight: 700 }}
                     formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-dashed mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest">No Sector Data</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total</p>
                <p className="text-xl font-black">₹{stats.totals.expense.toLocaleString('en-IN', { maximumSignificantDigits: 3 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
