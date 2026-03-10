import React, { useMemo } from 'react';
import { User, Transaction } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface SpreadHistoryProps {
    user: User;
    transactions: Transaction[];
    onNavigate: (page: string) => void;
}

const SpreadHistory: React.FC<SpreadHistoryProps> = ({ user, transactions, onNavigate }) => {
    const spreadRewards = useMemo(() => {
        return transactions
            .filter(tx => tx.type === 'spread_link_reward')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    const totalEarned = useMemo(() => {
        return spreadRewards.reduce((sum, tx) => sum + tx.amount, 0);
    }, [spreadRewards]);

    return (
        <div className="pt-32 md:pt-36 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <BackToDashboard onNavigate={onNavigate} />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                            Earning History
                        </div>
                        <h1 className="text-3xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight md:leading-[0.9] mb-4 md:mb-6">
                            Spread <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Ledger</span>
                        </h1>
                        <p className="text-slate-400 md:text-slate-500 font-medium text-sm md:text-xl leading-relaxed max-w-2xl">
                            Track your performance and verified rewards from the Spread Link Network accelerator.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-w-[280px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Network Yield</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">${totalEarned.toFixed(3)}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-indigo-600">USD</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source / Method</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {spreadRewards.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                <i className="fa-solid fa-receipt text-3xl"></i>
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No earning history recorded yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    spreadRewards.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{tx.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-sm">
                                                        <i className="fa-solid fa-link"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{tx.method || 'Spread Link Reward'}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Accelerator</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.date}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                    Verified
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">+${tx.amount.toFixed(3)}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpreadHistory;
