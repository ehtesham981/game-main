import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface FreelanceFigmaProps {
    user: User;
    onBack: () => void;
}

const FreelanceFigma: React.FC<FreelanceFigmaProps> = ({ user, onBack }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="pt-24 pb-20 min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Coming Soon Overlay */}
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-50/10 backdrop-blur-[6px] pointer-events-none">
                <div className="bg-white/80 backdrop-blur-3xl border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] p-12 md:p-20 rounded-[4rem] text-center animate-in zoom-in-95 duration-500 pointer-events-auto">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-indigo-200 animate-bounce">
                        <i className="fa-brands fa-figma text-4xl"></i>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                        Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Soon</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto leading-relaxed mb-10">
                        Our specialized Figma marketplace is currently under development. Get your portfolios ready!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em]">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Alpha Launch Approaching
                        </div>
                        <button
                            onClick={onBack}
                            className="inline-flex items-center gap-4 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 opacity-40 grayscale-[0.5]">

                {/* Header Section */}
                <header className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                <i className="fa-brands fa-figma text-xl"></i>
                            </div>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 shadow-sm">Premium Creative Hub</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Freelance Figma</h1>
                        <p className="text-slate-500 max-w-2xl font-medium text-lg">
                            Monetize your design skills. Connect with premium clients and deliver world-class Figma prototypes.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="bg-slate-900 px-8 py-4 rounded-2xl text-white shadow-xl shadow-slate-200 flex items-center gap-4 group cursor-pointer hover:bg-indigo-600 transition-all">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ready to Design?</span>
                                <span className="text-sm font-black">Submit Portfolio</span>
                            </div>
                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </header>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Available Projects</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Curated design opportunities</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
                                        <i className="fa-solid fa-filter text-xs"></i>
                                    </button>
                                    <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
                                        <i className="fa-solid fa-magnifying-glass text-xs"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Empty State / Placeholder */}
                            <div className="py-20 text-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-pen-nib text-4xl"></i>
                                </div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tighter mb-2">No active projects matching your profile</h4>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">Projects are being manually reviewed by our creative directors. Check back shortly for new listings.</p>
                            </div>
                        </div>

                        {/* How it Works */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                                <i className="fa-solid fa-bolt-lightning absolute -right-4 -top-4 text-8xl opacity-5 group-hover:scale-110 transition-transform duration-700"></i>
                                <h4 className="text-lg font-black uppercase tracking-widest mb-4">Fast Payouts</h4>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Receive your earnings in your vault tokens immediately after project approval.</p>
                                <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                                    <span>Learn more</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            </div>
                            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white overflow-hidden relative group shadow-xl shadow-indigo-100">
                                <i className="fa-solid fa-shield-halved absolute -right-4 -top-4 text-8xl opacity-10 group-hover:scale-110 transition-transform duration-700"></i>
                                <h4 className="text-lg font-black uppercase tracking-widest mb-4">Secure Contracts</h4>
                                <p className="text-white/80 text-sm leading-relaxed mb-6">All projects are backed by our escrow system ensuring you get paid for your work.</p>
                                <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                                    <span>View Policy</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Designer Profile</h3>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 tracking-tighter leading-none mb-2">{user.username}</p>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                                        Level 0 Designer
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Skill Verification</span>
                                        <span className="text-[9px] font-black text-indigo-600">0%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all">
                                    Take Skill Test
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-black tracking-tight mb-2">Need a Custom Design?</h4>
                                <p className="text-indigo-100 text-xs font-medium mb-6 opacity-80 leading-relaxed">Looking for a designer for your project? Post a brief and let artists bid.</p>
                                <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">
                                    Post a Gig
                                </button>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FreelanceFigma;
