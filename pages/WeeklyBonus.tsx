import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface WeeklyBonusProps {
    user: User;
    transactions: Transaction[];
    onClaim: (reward: number) => Promise<void>;
    onBack?: () => void;
    onNavigate?: (page: string) => void;
}

const WeeklyBonus: React.FC<WeeklyBonusProps> = ({ user, transactions, onClaim, onBack, onNavigate }) => {
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const REWARD_BALANCE = 0.008; // $0.008
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!user.lastWeeklyBonusClaim) {
                setTimeLeft(0);
                return;
            }
            const now = Date.now();
            const diff = now - user.lastWeeklyBonusClaim;
            const remaining = Math.max(0, WEEK_MS - diff);
            setTimeLeft(remaining);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [user.lastWeeklyBonusClaim]);

    const formatTime = (ms: number) => {
        const days = Math.floor(ms / (24 * 60 * 60 * 1000));
        const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((ms % (60 * 1000)) / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const handleClaim = async () => {
        if (timeLeft && timeLeft > 0) return;
        setIsClaiming(true);
        try {
            await onClaim(REWARD_BALANCE);
        } catch (error) {
            console.error(error);
        } finally {
            setIsClaiming(false);
        }
    };

    const bonusHistory = transactions
        .filter(tx => tx.type === 'weekly_bonus')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-12">

                {onNavigate && <BackToDashboard onNavigate={onNavigate} />}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                            <i className="fa-solid fa-gift"></i>
                            Loyalty Reward System
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
                            Weekly <span className="text-indigo-600">Bonus Hub</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                            Unlock your recurring $0.008 reward every 7 days as a token of appreciation for being part of our network.
                        </p>
                    </div>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
                        >
                            <i className="fa-solid fa-arrow-left"></i> Back to Jobs
                        </button>
                    )}
                </div>

                {/* Main Action Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 border border-white/5 relative overflow-hidden shadow-3xl flex flex-col justify-center min-h-[400px]">
                        <div className="relative z-10">
                            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Current Status</h3>

                            {timeLeft === 0 ? (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl text-white shadow-2xl shadow-indigo-900/40 animate-bounce">
                                            <i className="fa-solid fa-check-double"></i>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-white tracking-tighter uppercase">Reward Available</p>
                                            <p className="text-indigo-300 font-bold text-sm">$0.008 USD Ready for Claim</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClaim}
                                        disabled={isClaiming}
                                        className="w-full py-8 bg-white text-slate-900 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] hover:bg-indigo-400 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                                    >
                                        {isClaiming ? <i className="fa-solid fa-spinner fa-spin mr-3"></i> : <i className="fa-solid fa-clover mr-3"></i>}
                                        {isClaiming ? 'Processing Claim...' : 'Claim Now'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-3xl text-slate-400">
                                            <i className="fa-solid fa-clock"></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Next Reward In</p>
                                            <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter">
                                                {timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 transition-all duration-1000"
                                                style={{ width: `${((WEEK_MS - (timeLeft || 0)) / WEEK_MS) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 text-[9px] font-black uppercase text-slate-500">
                                            <span>Cycle Start</span>
                                            <span>{Math.round(((WEEK_MS - (timeLeft || 0)) / WEEK_MS) * 100)}% Synchronized</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <i className="fa-solid fa-star absolute -right-12 -bottom-12 text-[20rem] text-white/5 -rotate-12 pointer-events-none"></i>
                    </div>

                    <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-slate-200 relative overflow-hidden group shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl text-2xl mb-8">
                                <i className="fa-solid fa-circle-dollar-to-slot"></i>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Earning Protocol</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                                Weekly bonuses are distributed instantly to your Main Vault upon claim. These rewards can be used for withdrawals or to fund your own advertising campaigns.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Cycle Period</p>
                                    <p className="text-xl font-black text-slate-900">7 Days</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Vault Deposit</p>
                                    <p className="text-xl font-black text-indigo-600">$0.008 USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase text-slate-400">
                            <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                            Verified Secondary Income Stream
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/20 flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Bonus Ledger</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Historical data of loyalty claims</p>
                        </div>
                        <i className="fa-solid fa-history text-slate-100 text-4xl"></i>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                                <tr>
                                    <th className="px-10 py-6">Reference ID</th>
                                    <th className="px-6 py-6">Operation</th>
                                    <th className="px-6 py-6">Yield</th>
                                    <th className="px-6 py-6">Status</th>
                                    <th className="px-10 py-6 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bonusHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-32 text-center text-slate-300 uppercase text-[10px] font-black tracking-widest">
                                            No collection history found
                                        </td>
                                    </tr>
                                ) : (
                                    bonusHistory.map(tx => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-6 font-mono text-[10px] font-black text-indigo-400">{tx.id.substring(0, 10).toUpperCase()}</td>
                                            <td className="px-6 py-6">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded-lg uppercase border border-indigo-100">
                                                    Loyalty Bonus
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 font-black text-emerald-600 text-base">
                                                +${tx.amount.toFixed(3)} <span className="text-[9px] opacity-40">USD</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    <span className="text-[9px] font-black uppercase text-emerald-600">Success</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right text-[10px] font-black text-slate-400 tabular-nums">{tx.date}</td>
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

export default WeeklyBonus;
