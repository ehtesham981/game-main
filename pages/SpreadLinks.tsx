
import React from 'react';
import { User, SpreadLink } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface SpreadLinksProps {
    user: User;
    onNavigate: (page: string, params?: any) => void;
    spreadLinks: SpreadLink[];
}

const SpreadLinks: React.FC<SpreadLinksProps> = ({ user, onNavigate, spreadLinks }) => {


    return (
        <div className="pt-32 md:pt-36 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <BackToDashboard onNavigate={onNavigate} />

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {spreadLinks.filter(l => !user.completedTasks?.includes(l.id)).map((link) => (
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
                    ))}

                    {spreadLinks.filter(l => !user.completedTasks?.includes(l.id)).length === 0 && (
                        <div className="col-span-full py-16 md:py-20 text-center bg-white rounded-3xl md:rounded-[4rem] border border-dashed border-slate-300 px-6">
                            <i className="fa-solid fa-circle-check text-4xl md:text-5xl text-emerald-500 mb-6"></i>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">All Links Completed</h3>
                            <p className="text-slate-400 md:text-slate-500 font-medium text-xs md:text-sm mt-2">You've successfully cleared the current Spread Link network. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpreadLinks;
