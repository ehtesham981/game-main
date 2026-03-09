
import React from 'react';
import { User, SpreadLink } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface SpreadLinksProps {
    user: User;
    onNavigate: (page: string, params?: any) => void;
}

const SpreadLinks: React.FC<SpreadLinksProps> = ({ user, onNavigate }) => {
    // Dummy data for spread links
    const spreadLinks: SpreadLink[] = [
        {
            id: 'SL-001',
            title: 'Visit Tech News',
            description: 'Read the latest technology updates and trends in the industry.',
            url: 'https://news.google.com',
            reward: 0.005,
            timer: 20
        },
        {
            id: 'SL-002',
            title: 'Explore AI Tools',
            description: 'Discover the most powerful AI tools available for developers.',
            url: 'https://openai.com',
            reward: 0.007,
            timer: 20
        },
        {
            id: 'SL-003',
            title: 'Crypto Market Update',
            description: 'Check out the real-time prices and trends of major cryptocurrencies.',
            url: 'https://coinmarketcap.com',
            reward: 0.006,
            timer: 20
        },
        {
            id: 'SL-004',
            title: 'Modern Web Frameworks',
            description: 'A deep dive into the most popular React and Nextjs frameworks of 2024.',
            url: 'https://vercel.com',
            reward: 0.008,
            timer: 20
        }
    ];

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <BackToDashboard onNavigate={onNavigate} />

                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                        <i className="fa-solid fa-link-slash"></i>
                        Spread Link Network
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
                        Traffic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Accelerator</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                        Visit verified partner links, stay engaged for the required duration, and earn instant USD rewards.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {spreadLinks.filter(l => !user.completedTasks?.includes(l.id)).map((link) => (
                        <div
                            key={link.id}
                            className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{link.title}</h3>
                                </div>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                                    {link.description}
                                </p>

                                <div className="flex gap-2 mb-8">
                                    <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-lg border border-indigo-100 flex items-center gap-2">
                                        <i className="fa-solid fa-coins"></i>
                                        ${link.reward.toFixed(3)}
                                    </div>
                                    <div className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[8px] font-black uppercase rounded-lg border border-slate-100 flex items-center gap-2">
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
                        <div className="col-span-full py-20 text-center bg-white rounded-[4rem] border border-dashed border-slate-300">
                            <i className="fa-solid fa-circle-check text-5xl text-emerald-500 mb-6"></i>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">All Links Completed</h3>
                            <p className="text-slate-500 font-medium text-sm mt-2">You've successfully cleared the current Spread Link network. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpreadLinks;
