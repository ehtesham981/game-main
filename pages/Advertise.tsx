
import React, { useState } from 'react';
import { User, Task } from '../types';
import { storage } from '../services/storage';

interface AdvertiseProps {
    user: User;
    onRefresh: () => void;
    onNavigate: (page: string) => void;
}

const Advertise: React.FC<AdvertiseProps> = ({ user, onRefresh, onNavigate }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateAdvertiseId = async () => {
        setIsGenerating(true);
        try {
            const newId = `ADV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            await storage.updateUserInCloud(user.id, { advertiseId: newId });
            onRefresh();
            alert(`Advertiser ID Generated: ${newId}`);
        } catch (error) {
            console.error("Failed to generate Advertise ID:", error);
            alert("System error: Failed to initialize Advertiser Node.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-12">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                            <i className="fa-solid fa-bullhorn"></i>
                            Advertising Hub
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
                            Scale Your <span className="text-indigo-600">Influence</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                            Deploy micro-tasks to our global workforce and watch your digital presence grow in real-time.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex items-center gap-8 group hover:border-indigo-500 transition-all duration-500">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-2xl group-hover:bg-indigo-600 transition-colors">
                            <i className="fa-solid fa-fingerprint"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Advertiser ID</p>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-black text-slate-900 font-mono tracking-widest">
                                    {user.advertiseId || "UNCERTIFIED"}
                                </span>
                                {!user.advertiseId && (
                                    <button
                                        onClick={generateAdvertiseId}
                                        disabled={isGenerating}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50"
                                    >
                                        {isGenerating ? <i className="fa-solid fa-sync fa-spin"></i> : "Generate ID"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-3xl text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 uppercase">New Campaign</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                            Initialize a new advertisement node and define your micro-task requirements.
                        </p>
                        <button
                            onClick={() => onNavigate('create-task')}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                        >
                            Deploy Now
                        </button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-all"></div>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-3xl text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 uppercase">My Campaigns</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                            Monitor your active deployment nodes and track audit results in real-time.
                        </p>
                        <button
                            onClick={() => onNavigate('my-campaigns')}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                        >
                            Management Hub
                        </button>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-3xl group relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-3xl text-white mb-8">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase">Node Balance</h3>
                            <p className="text-slate-400 font-bold text-sm leading-relaxed mb-6">
                                Your advertising credits for deploying tasks.
                            </p>
                            <div className="text-5xl font-black text-white tabular-nums mb-2">
                                {user.depositBalance?.toLocaleString() || 0}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Coins Available</span>
                        </div>
                        <button
                            onClick={() => onNavigate('wallet')}
                            className="relative z-10 w-full py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                        >
                            Add Hub Credits
                        </button>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 bg-white p-12 md:p-16 rounded-[4rem] border border-slate-200">
                    <div className="space-y-6">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Why Choose <span className="text-indigo-600">AdsPredia?</span></h4>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Our network provides a unique synergy between advertisers and micro-task workers.
                            By leveraging our dual-proof verification system, you ensure that every coin spent translates into real, verified engagement.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { icon: 'fa-bolt', text: 'Instant Deployment Nodes' },
                                { icon: 'fa-check-double', text: 'Precision Proof Verification' },
                                { icon: 'fa-globe', text: 'Global Workforce Access' }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-sm font-black text-slate-700 uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-300 text-4xl mb-8">
                            <i className="fa-solid fa-rocket"></i>
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Ready to grow?</p>
                        <h4 className="text-2xl font-black text-slate-900 mb-8 max-w-xs">Start your first advertising campaign today.</h4>
                        <button
                            onClick={() => onNavigate('create-task')}
                            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                        >
                            Initialize Node
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Advertise;
