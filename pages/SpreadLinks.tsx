
import React, { useState, useMemo } from 'react';
import { User, SpreadLink, Transaction } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface SpreadLinksProps {
    user: User;
    onNavigate: (page: string, params?: any) => void;
    spreadLinks: SpreadLink[];
    transactions: Transaction[];
}

const SpreadLinks: React.FC<SpreadLinksProps> = ({ user, onNavigate, spreadLinks, transactions }) => {
    const [activeTab, setActiveTab] = useState<'links' | 'history'>('links');

    const spreadRewards = useMemo(() => {
        return transactions
            .filter(tx => tx.type === 'spread_link_reward')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    const availableLinks = spreadLinks.filter(l => !user.completedTasks?.includes(l.id));

    return (
        <div className="pt-32 md:pt-36 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                            <i className="fa-solid fa-link-slash"></i>
                            Spread Link Network
                        </div>
                        <h1 className="text-3xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight md:leading-[0.9] mb-4 md:mb-6">
                            Traffic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Accelerator</span>
                        </h1>
                        <p className="text-slate-400 md:text-slate-500 font-medium text-sm md:text-xl leading-relaxed max-w-2xl">
                            Visit verified partner links, stay engaged for the required duration, and earn instant USD rewards.
                        </p>
                    </div>

                    <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm self-start md:self-auto">
                        <button
                            onClick={() => setActiveTab('links')}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'links' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            Available Links ({availableLinks.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            Earning History
                        </button>
                    </div>
                </div>

                {activeTab === 'links' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-500">
                        {availableLinks.length === 0 ? (
                            <div className="col-span-full py-16 md:py-20 text-center bg-white rounded-3xl md:rounded-[4rem] border border-dashed border-slate-300 px-6">
                                <i className="fa-solid fa-circle-check text-4xl md:text-5xl text-emerald-500 mb-6"></i>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">All Links Completed</h3>
                                <p className="text-slate-400 md:text-slate-500 font-medium text-xs md:text-sm mt-2">You've successfully cleared the current Spread Link network. Check back later!</p>
                            </div>
                        ) : (
                            availableLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-xl md:text-2xl text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{link.title}</h3>
                                        </div>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 md:mb-8 line-clamp-2 md:line-clamp-none">
                                            {link.description}
                                        </p>

                                        <div className="flex gap-2 mb-6 md:mb-8">
                                            <div className="px-3 py-2 bg-indigo-50 text-indigo-600 text-[9px] md:text-[10px] font-black uppercase rounded-lg border border-indigo-100 flex items-center gap-2">
                                                <i className="fa-solid fa-coins"></i>
                                                ${link.reward.toFixed(3)}
                                            </div>
                                            <div className="px-3 py-2 bg-slate-50 text-slate-500 text-[9px] md:text-[10px] font-black uppercase rounded-lg border border-slate-100 flex items-center gap-2">
                                                <i className="fa-solid fa-clock"></i>
                                                {link.timer}S
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onNavigate(`spread-link-viewer|${link.id}`)}
                                        className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                                    >
                                        Visit Link
                                    </button>

                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-all"></div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
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
                )}
            </div>
        </div>
    );
};

export default SpreadLinks;
