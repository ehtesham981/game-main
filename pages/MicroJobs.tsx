
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import BackToDashboard from '../components/BackToDashboard';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroJobsProps {
    user: User;
    onNavigate: (page: string) => void;
}

interface Shortlink {
    id: string;
    title: string;
    description: string;
    reward: string;
    icon: string;
    color: string;
    url: string;
}

const MicroJobs: React.FC<MicroJobsProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'offers' | 'shortlinks'>('offers');
    const [visitingLink, setVisitingLink] = useState<Shortlink | null>(null);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isCounting, setIsCounting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
            id: 'shortlinks-card',
            title: 'Shotlinks Node',
            description: 'Visit accelerated shortlinks and earn rewards by completing quick verifications.',
            icon: 'fa-link',
            color: 'rose',
            reward: 'Instant $',
            buttonText: 'Open Tab',
            isTabLink: true
        },
        {
            id: 'weekly-bonus',
            title: 'Weekly Bonus',
            description: 'Claim your exclusive weekly loyalty reward of $0.09 every 7 days.',
            icon: 'fa-gift',
            color: 'indigo',
            reward: '$0.09 Reward',
            buttonText: 'Access Hub'
        }
    ];

    const shortlinks: Shortlink[] = [
        { id: 'sl1', title: 'Premium Link #01', description: 'Authorized premium traffic node.', reward: '$0.005', icon: 'fa-link', color: 'indigo', url: '#' },
        { id: 'sl2', title: 'Secured Link #02', description: 'End-to-end verified partner.', reward: '$0.005', icon: 'fa-shield-halved', color: 'emerald', url: '#' },
        { id: 'sl3', title: 'Rapid Link #03', description: 'Fastest completion reward.', reward: '$0.008', icon: 'fa-bolt', color: 'amber', url: '#' },
        { id: 'sl4', title: 'Network Link #04', description: 'Global node verification.', reward: '$0.006', icon: 'fa-network-wired', color: 'rose', url: '#' },
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCounting && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsCounting(false);
        }
        return () => clearInterval(interval);
    }, [isCounting, timeLeft]);

    const handleVisitLink = (link: Shortlink) => {
        setVisitingLink(link);
        setTimeLeft(20);
        setIsCounting(true);
        setIsSuccess(false);
        // Simulate window open
        window.open(link.url, '_blank');
    };

    const handleClaim = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setVisitingLink(null);
            setIsSuccess(false);
        }, 2000);
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

                <BackToDashboard onNavigate={onNavigate} />

                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                        <i className="fa-solid fa-briefcase"></i>
                        Micro-Job Network
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
                        Earning <span className="text-indigo-600">Simplified</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                        Choose from a variety of authorized micro-jobs and start accumulating USD wealth across our verified partner network.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-4 mb-12 p-1.5 bg-slate-100 rounded-[2.5rem] max-w-fit border border-slate-200">
                    <button
                        onClick={() => setActiveTab('offers')}
                        className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'offers' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Marketplace
                    </button>
                    <button
                        onClick={() => setActiveTab('shortlinks')}
                        className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'shortlinks' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Shotlinks
                    </button>
                </div>

                {activeTab === 'offers' ? (
                    /* Earning Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {earningOptions.map((option) => (
                            <div
                                key={option.id}
                                className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className={`w-20 h-20 bg-${option.color}-50 rounded-[2rem] flex items-center justify-center text-3xl text-${option.color}-600 mb-8 group-hover:bg-${option.color}-600 group-hover:text-white transition-all duration-500`}>
                                        <i className={`fa-solid ${option.icon}`}></i>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{option.title}</h3>
                                        <span className={`px-3 py-1 bg-${option.color}-50 text-${option.color}-600 text-[8px] font-black uppercase rounded-full border border-${option.color}-100 whitespace-nowrap`}>
                                            {option.reward}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                                        {option.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        if ('isTabLink' in option && option.isTabLink) {
                                            setActiveTab('shortlinks');
                                        } else {
                                            onNavigate(option.id);
                                        }
                                    }}
                                    className={`w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-${option.color}-600 transition-all shadow-xl`}
                                >
                                    {option.buttonText}
                                </button>

                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${option.color}-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${option.color}-600/10 transition-all`}></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Shortlinks View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        <AnimatePresence>
                            {shortlinks.map((link) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={link.id}
                                    className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-16 h-16 bg-${link.color}-50 rounded-2xl flex items-center justify-center text-2xl text-${link.color}-600 group-hover:bg-${link.color}-600 group-hover:text-white transition-all duration-500`}>
                                            <i className={`fa-solid ${link.icon}`}></i>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Potential Reward</span>
                                            <span className={`text-xl font-black text-${link.color}-600 uppercase`}>{link.reward}</span>
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">{link.title}</h4>
                                    <p className="text-slate-500 text-xs font-medium mb-8 pr-10">{link.description}</p>

                                    <button
                                        onClick={() => handleVisitLink(link)}
                                        disabled={visitingLink !== null}
                                        className={`w-full py-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-${link.color}-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Visit Link
                                    </button>

                                    {/* Timer Overlay */}
                                    <AnimatePresence>
                                        {visitingLink?.id === link.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center"
                                            >
                                                {!isSuccess ? (
                                                    <>
                                                        <div className="relative w-24 h-24 mb-6">
                                                            <svg className="w-full h-full transform -rotate-90">
                                                                <circle
                                                                    cx="48"
                                                                    cy="48"
                                                                    r="40"
                                                                    stroke="currentColor"
                                                                    strokeWidth="6"
                                                                    fill="transparent"
                                                                    className="text-slate-100"
                                                                />
                                                                <motion.circle
                                                                    cx="48"
                                                                    cy="48"
                                                                    r="40"
                                                                    stroke="currentColor"
                                                                    strokeWidth="6"
                                                                    fill="transparent"
                                                                    strokeDasharray="251.2"
                                                                    style={{ pathLength: timeLeft / 20 }}
                                                                    className={`text-${link.color}-600`}
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-3xl font-black text-slate-900">{timeLeft}s</span>
                                                            </div>
                                                        </div>
                                                        <h5 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2">Verification in Progress</h5>
                                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-loose mb-8">Please keep the opened tab active<br />for the verification to complete</p>

                                                        {timeLeft === 0 ? (
                                                            <button
                                                                onClick={handleClaim}
                                                                className={`px-10 py-4 bg-${link.color}-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-${link.color}-700 transition-all shadow-lg animate-bounce`}
                                                            >
                                                                Continue & Claim
                                                            </button>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Waiting for link node...</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <motion.div
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="text-center"
                                                    >
                                                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                                            <i className="fa-solid fa-check"></i>
                                                        </div>
                                                        <h5 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Success!</h5>
                                                        <p className="text-emerald-600/80 text-[10px] font-black uppercase tracking-widest">Reward credited to your nodes</p>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Statistics / Fun Footer */}
                <div className="bg-slate-900 p-12 md:p-16 rounded-[4rem] shadow-3xl relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h4 className="text-3xl font-black text-white tracking-tighter uppercase mb-6">Your <span className="text-indigo-400">Activity Profile</span></h4>
                            <p className="text-slate-400 font-bold text-sm leading-relaxed mb-8">
                                Track your progress and authorized job completions in real-time. Our network synchronizes your balance across all Micro-Job nodes.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl min-w-[140px]">
                                    <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Balance</span>
                                    <span className="text-2xl font-black text-white tabular-nums">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 3 })}</span>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl min-w-[140px]">
                                    <span className="block text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</span>
                                    <span className="text-2xl font-black text-white uppercase">{user.isLoggedIn ? 'Active' : 'Offline'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 text-center">
                            <i className="fa-solid fa-rocket text-4xl text-indigo-400 mb-6 animate-pulse"></i>
                            <h5 className="text-xl font-black text-white mb-4">Want more rewards?</h5>
                            <p className="text-slate-400 text-xs font-medium mb-8">Invite your network and earn 10% from every micro-job completion they perform.</p>
                            <button
                                onClick={() => onNavigate('referrals')}
                                className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
                            >
                                Go to Affiliate Hub
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
