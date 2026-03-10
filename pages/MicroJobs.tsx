
import React from 'react';
import { User } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface MicroJobsProps {
    user: User;
    onNavigate: (page: string) => void;
    initialTab?: string;
}

const MicroJobs: React.FC<MicroJobsProps> = ({ user, onNavigate, initialTab = 'offers' }) => {
    const [activeTab, setActiveTab] = React.useState(initialTab);

    // Sync state if initialTab changes (e.g. via navigation)
    React.useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);
    const earningOptions = [
        {
            id: 'tasks',
            title: 'Task Marketplace',
            description: 'Complete micro-tasks like watching videos, visiting websites, or following social media profiles.',
            icon: 'fa-tasks',
            color: 'indigo',
            reward: 'High Yield',
            buttonText: 'Start Tasks'
        },
        {
            id: 'math-solver',
            title: 'Math Solver',
            description: 'Solve mathematical expressions to earn instant rewards. Test your speed and accuracy.',
            icon: 'fa-calculator',
            color: 'emerald',
            reward: 'Daily Bonus',
            buttonText: 'Solve & Earn'
        },
        {
            id: 'spin',
            title: 'Lucky Spin',
            description: 'Try your luck at the spin wheel for a chance to win up to $0.020 USD every day.',
            icon: 'fa-clover',
            color: 'amber',
            reward: 'Luck Based',
            buttonText: 'Spin Now'
        },
        {
            id: 'spread-links',
            title: 'Spread Links',
            description: 'Visit partner websites and stay engaged for 20 seconds to earn instant USD rewards.',
            icon: 'fa-link',
            color: 'blue',
            reward: 'Instant Pay',
            buttonText: 'Open Links'
        },
        {
            id: 'weekly-bonus',
            title: 'Weekly Bonus',
            description: 'Claim your exclusive weekly loyalty reward of $0.008 every 7 days.',
            icon: 'fa-gift',
            color: 'indigo',
            reward: '$0.008 Reward',
            buttonText: 'Start Mission'
        }

    ];

    return (
        <div className="pt-28 md:pt-32 pb-16 md:pb-24 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-12 space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">


                {/* Header Section */}
                <div className="max-w-3xl mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 border border-indigo-100 shadow-sm">
                        <i className="fa-solid fa-briefcase"></i>
                        Micro-Job Network
                    </div>
                    <h1 className="text-3xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight md:leading-[0.9] mb-4 md:mb-6">
                        Earning <span className="text-indigo-600">Simplified</span>
                    </h1>
                    <p className="text-slate-400 md:text-slate-500 font-medium text-sm md:text-xl leading-relaxed max-w-2xl">
                        Choose from a variety of authorized micro-jobs and start accumulating USD wealth across our verified partner network.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 md:gap-4 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('offers')}
                        className={`pb-4 px-4 text-[10px] md:text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'offers' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Offers
                        {activeTab === 'offers' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('shortlinks')}
                        className={`pb-4 px-4 text-[10px] md:text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'shortlinks' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Shortlinks
                        {activeTab === 'shortlinks' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
                    </button>
                </div>

                {activeTab === 'offers' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {earningOptions.map((option) => (
                            <div
                                key={option.id}
                                className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className={`w-14 h-14 md:w-20 md:h-20 bg-${option.color}-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-xl md:text-3xl text-${option.color}-600 mb-6 md:mb-8 group-hover:bg-${option.color}-600 group-hover:text-white transition-all duration-500`}>
                                        <i className={`fa-solid ${option.icon}`}></i>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter uppercase">{option.title}</h3>
                                        <span className={`px-2 md:px-3 py-1 bg-${option.color}-50 text-${option.color}-600 text-[8px] font-black uppercase rounded-full border border-${option.color}-100`}>
                                            {option.reward}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed mb-6 md:mb-10">
                                        {option.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => onNavigate(option.id)}
                                    className={`w-full py-4 md:py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-${option.color}-600 transition-all shadow-xl`}
                                >
                                    {option.buttonText}
                                </button>

                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${option.color}-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${option.color}-600/10 transition-all`}></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-slate-200 text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-2xl md:text-3xl text-indigo-600 mx-auto mb-6 md:mb-8">
                            <i className="fa-solid fa-link"></i>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4">Shortlink Wall</h3>
                        <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed mb-8 max-w-md mx-auto">
                            Complete shortlinks from our verified partners to earn instant USD rewards. Use our secure proxy node to protect your identity.
                        </p>
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            Coming Soon in v2.4
                        </div>
                    </div>
                )}

                {/* Statistics / Fun Footer */}
                <div className="bg-slate-900 p-6 md:p-16 rounded-3xl md:rounded-[4rem] shadow-3xl relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <h4 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6">Your <span className="text-indigo-400">Activity Profile</span></h4>
                            <p className="text-slate-400 font-bold text-[10px] md:text-sm leading-relaxed mb-6 md:mb-8">
                                Track your progress and authorized job completions in real-time. Our network synchronizes your balance across all Micro-Job nodes.
                            </p>
                            <div className="flex flex-wrap gap-4 md:gap-6">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl flex-grow md:flex-none min-w-[120px]">
                                    <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Balance</span>
                                    <span className="text-lg md:text-2xl font-black text-white tabular-nums">${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 3 })}</span>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl flex-grow md:flex-none min-w-[120px]">
                                    <span className="block text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</span>
                                    <span className="text-lg md:text-2xl font-black text-white uppercase">{user.isLoggedIn ? 'Active' : 'Offline'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white/5 backdrop-blur-md rounded-3xl md:rounded-[3rem] border border-white/10 text-center">
                            <i className="fa-solid fa-rocket text-2xl md:text-4xl text-indigo-400 mb-6 animate-pulse"></i>
                            <h5 className="text-base md:text-xl font-black text-white mb-4">Want more rewards?</h5>
                            <p className="text-slate-400 text-[9px] md:text-xs font-medium mb-6 md:mb-8">Invite your network and earn 10% from every micro-job completion they perform.</p>
                            <button
                                onClick={() => onNavigate('referrals')}
                                className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
                            >
                                Go to Referrals
                            </button>
                        </div>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent)]"></div>
                </div>
            </div>
        </div>
    );
};

export default MicroJobs;
