import React, { useMemo, useState, useEffect } from 'react';
import { User, Task, Transaction } from '../types';

interface DashboardProps {
  user: User;
  tasks: Task[];
  transactions: Transaction[];
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, data: Partial<Task>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, tasks, transactions }) => {
  const [ledgerTab, setLedgerTab] = useState<'all' | 'pending' | 'verified'>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const earnings = useMemo(() => {
    const total = user.balance || 0;
    const usd = total.toFixed(3);
    const pending = transactions
      .filter(tx => tx.type === 'earn' && tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { total, usd, pending };
  }, [user.balance, transactions]);

  const progressToNextMilestone = ((earnings.total % 0.5) / 0.5) * 100;

  const ledgerList = useMemo(() => {
    let filtered = transactions.filter(tx => ['earn', 'spin', 'referral_claim', 'math_reward', 'deposit', 'withdraw', 'spend', 'spread_link_reward'].includes(tx.type));
    if (ledgerTab === 'pending') filtered = filtered.filter(tx => tx.status === 'pending');
    else if (ledgerTab === 'verified') filtered = filtered.filter(tx => tx.status === 'success');

    return filtered
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [transactions, ledgerTab]);

  const activityStats = useMemo(() => {
    const counts: Record<string, number> = { 'Lucky Spin': 0, 'Referrals': 0, 'Math Solver': 0, 'Spread Links': 0 };
    transactions
      .filter(tx => tx.status === 'success')
      .forEach(tx => {
        if (tx.type === 'spin' || tx.method === 'Spin Wheel') counts['Lucky Spin'] += tx.amount;
        else if (tx.type === 'referral_claim') counts['Referrals'] += tx.amount;
        else if (tx.type === 'math_reward') counts['Math Solver'] += tx.amount;
        else if (tx.type === 'spread_link_reward') counts['Spread Links'] += tx.amount;
      });
    return counts;
  }, [transactions]);

  const maxActivityValue = Math.max(...(Object.values(activityStats) as number[]), 1);

  const getActivityIcon = (type: string = '', method: string = '') => {
    if (type === 'spin' || method === 'Spin Wheel') return 'fa-clover text-emerald-500';
    if (type === 'referral_claim') return 'fa-users text-blue-500';
    if (type === 'math_reward') return 'fa-calculator text-indigo-500';
    if (type === 'spread_link_reward') return 'fa-cloud-arrow-up text-blue-400';
    if (type === 'deposit') return 'fa-building-columns text-emerald-600';
    if (type === 'withdraw') return 'fa-wallet text-rose-500';
    return 'fa-coins text-amber-500';
  };

  if (!isClient) return null;

  if (!user || !user.isLoggedIn) {
    return (
      <div className="pt-40 pb-20 flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-8">
          <i className="fa-solid fa-lock text-4xl"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Secure Area</h2>
        <p className="text-slate-500 max-w-sm font-medium">Please synchronize your identity via the login gateway to access the analytics hub.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="dashboard-container animate-in fade-in slide-in-from-bottom-6 duration-700">

        <header className="dashboard-card-primary flex flex-col lg:flex-row lg:items-center justify-between gap-8 overflow-hidden">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-white text-2xl shadow-2xl shadow-slate-300 transition-transform group-hover:scale-105 overflow-hidden">
                <span className="font-black">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Welcome back, {user.username}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 shadow-sm">Verified Partner</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-id-badge text-indigo-500"></i>
                Authorized Access ID: <span className="text-slate-600 font-mono">{user.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Network Live</span>
              </div>
            </div>
            <div className="bg-indigo-600 px-8 py-4 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <span className="text-[10px] font-black uppercase tracking-widest">Node Level 01</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 dashboard-card-dark relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-12">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Earning Evaluation</p>
                  <div className="flex items-baseline gap-2 sm:gap-4 mb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-none truncate whitespace-nowrap" title={`$${earnings.usd}`}>${earnings.usd}</h2>
                    <span className="text-lg sm:text-xl font-bold text-slate-500 uppercase tracking-widest">USD</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-xs font-black shadow-inner flex items-center gap-3">
                      <i className="fa-solid fa-dollar-sign text-emerald-400"></i>
                      {earnings.usd} <span className="opacity-40 text-[10px]">USD</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full sm:w-auto">
                  <div className="stat-box">
                    <p className="text-[8px] font-black uppercase text-slate-500 mb-2 tracking-widest">Vault Balance</p>
                    <p className="text-2xl sm:text-3xl font-black tabular-nums">${earnings.usd}</p>
                  </div>
                  <div className="stat-box-emerald">
                    <p className="text-[8px] font-black uppercase text-emerald-400 mb-2 tracking-widest">Ad Credits</p>
                    <p className="text-2xl sm:text-3xl font-black tabular-nums text-emerald-400">${user.depositBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</p>
                  </div>
                  <div className="stat-box">
                    <p className="text-[8px] font-black uppercase text-slate-500 mb-2 tracking-widest">Ref Partners</p>
                    <p className="text-2xl sm:text-3xl font-black tabular-nums">{user.claimedReferrals?.length || 0}</p>
                  </div>
                  <div className="stat-box">
                    <p className="text-[8px] font-black uppercase text-slate-500 mb-2 tracking-widest">Link Yield</p>
                    <p className="text-2xl sm:text-3xl font-black tabular-nums">
                      ${transactions
                        .filter(tx => tx.type === 'spread_link_reward' && tx.status === 'success')
                        .reduce((sum, tx) => sum + tx.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 sm:mt-20 w-full max-w-2xl">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block mb-1">Earning Trajectory</span>
                    <span className="text-xs font-bold text-slate-400">Next Withdraw Milestone</span>
                  </div>
                  <span className="text-sm font-black text-white">{Math.floor(progressToNextMilestone)}%</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_25px_rgba(79,70,229,0.5)] relative overflow-hidden"
                    style={{ width: `${progressToNextMilestone}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-50"></div>
          </div>

          <div className="lg:col-span-4 dashboard-card-primary flex flex-col relative overflow-hidden">
            <div className="relative z-10 mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Revenue Analysis</h3>
              <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Activity Yield</h4>
            </div>

            <div className="flex-grow flex flex-col justify-center gap-6 relative z-10">
              {Object.entries(activityStats).map(([act, val], i) => (
                <div key={act} className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{act}</span>
                    <span className="text-slate-900">{(val as number).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${act === 'Lucky Spin' ? 'bg-emerald-500' :
                        act === 'Referrals' ? 'bg-blue-500' :
                          act === 'Math Solver' ? 'bg-indigo-500' :
                            'bg-indigo-400'
                        }`}
                      style={{ width: `${((val as number) / maxActivityValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Analysis synchronized with global ledger</p>
            </div>
          </div>
        </div>

        <div className="income-analysis-container">
          <div className="income-analysis-header">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Income Analysis</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit of yield and verification status</p>
            </div>

            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Activity' },
                { id: 'pending', label: 'In Audit' },
                { id: 'verified', label: 'Verified' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setLedgerTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${ledgerTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {ledgerList.length === 0 ? (
              <div className="col-span-full py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-100">
                  <i className="fa-solid fa-receipt text-4xl"></i>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No entries found for {ledgerTab} filter</p>
              </div>
            ) : (
              ledgerList.map((tx) => (
                <div key={tx.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${getActivityIcon(tx.type, tx.method)}`}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-black text-slate-900 tabular-nums">
                          {['withdraw', 'spend'].includes(tx.type) ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 3 })}
                        </span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">USD</span>
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{tx.date}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-[8px] font-black rounded-lg uppercase tracking-widest border transition-all ${tx.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                    }`}>
                    {tx.status === 'pending' ? 'Audit In-Progress' : 'Verified'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
};

export default Dashboard;