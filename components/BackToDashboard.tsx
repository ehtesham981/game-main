import React from 'react';

interface BackToDashboardProps {
    onNavigate?: (page: string) => void;
    to?: string;
    className?: string;
}

const BackToDashboard: React.FC<BackToDashboardProps> = ({ onNavigate, to = 'dashboard', className }) => {
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else if (onNavigate) {
            onNavigate(to);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-xl active:scale-95 z-[50] ${className}`}
        >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            Back
        </button>
    );
};

export default BackToDashboard;
