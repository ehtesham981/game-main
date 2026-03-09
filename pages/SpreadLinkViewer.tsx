
import React, { useState, useEffect } from 'react';
import { User, SpreadLink } from '../types';

interface SpreadLinkViewerProps {
    user: User;
    linkId: string;
    onComplete: (reward: number, title: string) => void;
    onBack: () => void;
}

const SpreadLinkViewer: React.FC<SpreadLinkViewerProps> = ({ user, linkId, onComplete, onBack }) => {
    // In a real app, we'd fetch the link by ID. For now, use dummy data or find in list.
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

    const link = spreadLinks.find(l => l.id === linkId) || spreadLinks[0];
    const [timeLeft, setTimeLeft] = useState(link.timer);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsCompleted(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col">
            {/* Top Navigation / Timer Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{link.title}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Earning Session</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {!isCompleted ? (
                        <div className="flex items-center gap-3 bg-indigo-50 px-5 py-2.5 rounded-2xl border border-indigo-100">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black animate-pulse">
                                {timeLeft}
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Seconds Remaining</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => onComplete(link.reward, link.title)}
                            className="bg-emerald-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all animate-bounce"
                        >
                            Complete & Claim Reward
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow relative bg-slate-200 overflow-hidden">
                <iframe
                    src={link.url}
                    className="w-full h-full border-none"
                    title={link.title}
                />

                {/* Fallback overlay in case iframe fails (common with strict CSP) */}
                <div className="absolute inset-x-0 bottom-0 p-12 pointer-events-none flex justify-center">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-3xl pointer-events-auto flex items-center gap-6">
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status Protocol</p>
                            <p className="text-sm font-black text-slate-900">Ensure this page remains active until timer expires.</p>
                        </div>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                        >
                            Open Content Link <i className="fa-solid fa-external-link ml-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpreadLinkViewer;
