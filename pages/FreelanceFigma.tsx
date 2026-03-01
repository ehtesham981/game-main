import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';

interface FreelanceFigmaProps {
    user: User;
    onBack: () => void;
    onUpdateUser: (data: Partial<User>) => Promise<void>;
}

const FreelanceFigma: React.FC<FreelanceFigmaProps> = ({ user, onBack, onUpdateUser }) => {
    const [isClient, setIsClient] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const categories = [
        {
            id: 'writing',
            title: 'Content Writing',
            icon: 'fa-pen-nib',
            color: 'bg-emerald-500',
            desc: 'Draft high-impact articles, ad copy, and technical documentation.',
            yield: '40-200 Coins/Task'
        },
        {
            id: 'graphics',
            title: 'Graphics Designing',
            icon: 'fa-palette',
            color: 'bg-indigo-500',
            desc: 'Create branding, social media assets, and professional UI mockups.',
            yield: '100-500 Coins/Task'
        },
        {
            id: 'blog',
            title: 'Blog Development',
            icon: 'fa-laptop-code',
            color: 'bg-amber-500',
            desc: 'Configure and deploy SEO-optimized WordPress/Next.js blogs.',
            yield: '500-2000 Coins/Task'
        },
        {
            id: 'seo',
            title: 'SEO Specialist',
            icon: 'fa-arrow-up-right-dots',
            color: 'bg-rose-500',
            desc: 'Optimize site rankings through backlink audits and technical SEO.',
            yield: '200-1000 Coins/Task'
        }
    ];

    const handleInitialize = async () => {
        setIsInitializing(true);
        const newId = 'FL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setTimeout(async () => {
            await onUpdateUser({ freelanceId: newId });
            setIsInitializing(false);
        }, 1500);
    };

    if (!isClient) return null;

    if (!user.freelanceId) {
        return (
            <div className="pt-24 pb-20 min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[4rem] border border-slate-200 shadow-3xl p-12 md:p-16 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl animate-bounce">
                        <i className="fa-solid fa-briefcase text-4xl"></i>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                        Freelance <span className="text-indigo-600">Gateway</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
                        Authorize your professional identity to access our specialized freelance marketplace. Each account requires a unique Freelance ID for secure payouts.
                    </p>
                    <button
                        onClick={handleInitialize}
                        disabled={isInitializing}
                        className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                        {isInitializing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Registering ID...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-id-card"></i>
                                Initialize Freelance ID
                            </>
                        )}
                    </button>
                    <button onClick={onBack} className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-12 animate-in fade-in duration-700">

                {/* Header Profile Section */}
                <header className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-3xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-4xl font-black border border-white/10">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Freelance Dashboard</h1>
                                <span className="px-4 py-1.5 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-400">Verified Pro</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                                    <i className="fa-solid fa-fingerprint"></i>
                                    Identity ID: <span className="text-white font-mono">{user.freelanceId}</span>
                                </p>
                                <span className="w-1 h-1 bg-white/20 rounded-full hidden md:block"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator: {user.username} {user.lastName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <button onClick={onBack} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3">
                            <i className="fa-solid fa-arrow-left"></i> Hub
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Marketplace Grid */}
                    <div className="lg:col-span-8 space-y-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Service Marketplace</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select your specialization node</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {categories.map((cat) => (
                                <div key={cat.id} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                                            <i className={`fa-solid ${cat.icon}`}></i>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{cat.title}</h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">{cat.desc}</p>
                                    </div>

                                    <div className="relative z-10 border-t border-slate-50 pt-8 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Yield</p>
                                            <p className="text-sm font-black text-emerald-600">{cat.yield}</p>
                                        </div>
                                        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-indigo-600 transition-colors shadow-lg">
                                            Enter Node
                                        </button>
                                    </div>
                                    <div className={`absolute -right-8 -bottom-8 text-8xl ${cat.color} opacity-5 -rotate-12 transition-transform group-hover:scale-110`}>
                                        <i className={`fa-solid ${cat.icon}`}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Performance Index</h3>
                            <div className="space-y-8">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black text-slate-900 uppercase">Pro Status</span>
                                        <span className="text-[10px] font-black text-indigo-600">Level 0</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner p-1">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '5%' }}></div>
                                    </div>
                                    <p className="mt-4 text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">Authorize first task to progress</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Projects</p>
                                        <p className="text-2xl font-black text-slate-900">0</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Rating</p>
                                        <p className="text-2xl font-black text-slate-900">N/A</p>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                                    Manage Portfolio
                                </button>
                            </div>
                        </div>

                        <div className="bg-indigo-600 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                            <div className="relative z-10">
                                <h4 className="text-2xl font-black tracking-tight mb-4">Enterprise Hub</h4>
                                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed opacity-80">Looking for custom solutions? Post a global brief here.</p>
                                <button className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                    Post Enterprise Request
                                </button>
                            </div>
                            <i className="fa-solid fa-rocket absolute -right-4 -bottom-4 text-7xl text-white/10 -rotate-12"></i>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Network Compliance</p>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black text-slate-900 uppercase">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelanceFigma;

