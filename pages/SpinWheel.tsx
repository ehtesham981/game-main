import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface SpinWheelProps {
  userBalance: number;
  onSpin: (reward: number, cost: number) => void;
  transactions: Transaction[];
  onNavigate?: (page: string) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ userBalance, onSpin, transactions, onNavigate }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinStats, setSpinStats] = useState({ count: 0, lastTimestamp: 0 });

  const SPIN_COST = 0;
  const DAILY_LIMIT = 5;
  const REWARDS = [0.002, 0.001, 0.003, 0.005, 0.004];
  const COLORS = [
    'bg-indigo-600', 'bg-slate-900', 'bg-amber-500',
    'bg-rose-500', 'bg-indigo-800', 'bg-emerald-600'
  ];

  const spinHistory = useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'spin' || (tx.type === 'earn' && tx.method === 'Spin Wheel'))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);
  const canSpin = spinStats.count < DAILY_LIMIT && !isSpinning;

  useEffect(() => {
    const saved = localStorage.getItem('spin_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - parsed.lastTimestamp > twentyFourHours) {
        const initial = { count: 0, lastTimestamp: 0 };
        setSpinStats(initial);
        localStorage.setItem('spin_stats', JSON.stringify(initial));
      } else {
        setSpinStats(parsed);
      }
    }
  }, []);

  const handleSpin = () => {
    if (isSpinning || spinStats.count >= DAILY_LIMIT) return;

    setIsSpinning(true);
    setResult(null);

    const rewardIndex = Math.floor(Math.random() * REWARDS.length);
    const winAmount = REWARDS[rewardIndex];

    const segmentAngle = 360 / REWARDS.length;
    const extraTurns = 360 * 10;
    const targetAngle = 360 - (rewardIndex * segmentAngle);
    const newRotation = rotation + extraTurns + targetAngle - (rotation % 360);

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(winAmount);

      const now = Date.now();
      const newStats = {
        count: spinStats.count + 1,
        lastTimestamp: spinStats.count === 0 ? now : spinStats.lastTimestamp
      };

      setSpinStats(newStats);
      localStorage.setItem('spin_stats', JSON.stringify(newStats));
      onSpin(winAmount, SPIN_COST);
    }, 4500);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {onNavigate && <BackToDashboard onNavigate={onNavigate} />}

        {/* Header Section */}
        <div className="text-center mb-24 max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-amber-200 shadow-sm shadow-amber-100">
            <i className="fa-solid fa-gem animate-pulse"></i>
            Earn 0.020$ Everyday
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Spin <span className="text-indigo-600">Dollers </span> Everyday
          </h1>
          <p className="text-slate-500 font-bold text-lg leading-relaxed px-4">
            Spin the high-yield nodal wheel for secured USD credit Earn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Status & Analytics Column */}
          <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Access Logic</p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black text-slate-900 uppercase">Spin Used</span>
                <span className="text-2xl font-black text-indigo-600 tabular-nums">{spinStats.count} <span className="text-[10px] opacity-40">/ {DAILY_LIMIT}</span></span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                  style={{ width: `${(spinStats.count / DAILY_LIMIT) * 100}%` }}
                ></div>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6">Total {spinStats.count}/{DAILY_LIMIT} spins used</p>
              <i className="fa-solid fa-bolt absolute -right-6 -bottom-6 text-7xl text-slate-50 group-hover:text-indigo-50 transition-all"></i>
            </div>

            {spinStats.count >= DAILY_LIMIT && (
              <div className="p-10 rounded-[3rem] bg-slate-900 border-2 border-indigo-500/30 shadow-3xl">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                    Quota exhausted. Global reset in progress.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Central Spin Architecture */}
          <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
            <div className="relative">
              {/* Pointer Indicator */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-40 drop-shadow-2xl">
                <div className="w-12 h-16 bg-indigo-600 rounded-b-full flex items-center justify-center border-4 border-white shadow-2xl animate-bounce">
                  <i className="fa-solid fa-caret-down text-white text-2xl"></i>
                </div>
              </div>

              {/* The Mechanical Wheel */}
              <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[550px] md:h-[550px] rounded-full p-6 sm:p-8 md:p-12 bg-slate-900 border-[10px] sm:border-[15px] md:border-[20px] border-slate-900 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] group">
                {/* Visual Depth Decoration */}
                <div className="absolute inset-4 md:inset-8 rounded-full border-4 border-indigo-500/10 pointer-events-none z-10 shadow-inner"></div>
                <div className="absolute -inset-2 rounded-full border border-white/5 pointer-events-none z-0"></div>

                <div
                  className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.1, 0, 0.1, 1)"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {REWARDS.map((rew, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-full origin-center"
                      style={{ transform: `rotate(${(360 / REWARDS.length) * i}deg)` }}
                    >
                      <div
                        className={`absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-[75%] flex flex-col items-center pt-10 sm:pt-16 md:pt-24 font-black ${COLORS[i % COLORS.length]} text-white border-r border-white/10`}
                        style={{
                          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                          transformOrigin: 'bottom center'
                        }}
                      >
                        <span className="text-xl sm:text-2xl md:text-3xl tracking-tighter transform rotate-180 mb-4 md:mb-6 drop-shadow-lg">${rew.toFixed(3)}</span>
                        <i className="fa-solid fa-bolt text-xs md:text-base text-white/30 transform rotate-180"></i>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Core Hub Module */}
                <div className="absolute inset-0 m-auto w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-slate-900 rounded-full z-30 border-[4px] sm:border-[8px] border-slate-800 shadow-3xl flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl border-2 sm:border-4 border-white/10 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-bolt-lightning text-white text-xl sm:text-2xl md:text-4xl animate-pulse"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center w-full max-w-sm">
              {result !== null && !isSpinning && (
                <div className="mb-12 animate-in zoom-in duration-500">
                  <div className={`text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl ${result > 0 ? 'text-amber-500' : 'text-slate-400 opacity-50'}`}>
                    {result > 0 ? `+$${result.toFixed(3)}` : '$0.000'}
                  </div>
                  <div className="text-[12px] font-black text-slate-900 uppercase tracking-[0.6em] mt-4 flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-slate-200"></span>
                    GOLD CREDIT SECURED
                    <span className="w-8 h-px bg-slate-200"></span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSpin}
                disabled={!canSpin}
                className={`relative w-full py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] transition-all overflow-hidden ${!canSpin
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-3xl shadow-slate-300'
                  }`}
              >
                <span className="relative z-10">{isSpinning ? 'CALCULATING NODE...' : 'INITIALIZE SPIN'}</span>
                {canSpin && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                )}
              </button>
            </div>
          </div>

          {/* Winning History Column */}
          <div className="lg:col-span-3 space-y-8 order-3">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter">Operational History</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit of recent wins</p>
                </div>
                <i className="fa-solid fa-receipt text-slate-100 text-3xl"></i>
              </div>

              <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto no-scrollbar">
                {spinHistory.length === 0 ? (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <i className="fa-solid fa-ghost text-3xl"></i>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No activity</p>
                  </div>
                ) : (
                  spinHistory.slice(0, 10).map((tx: Transaction) => (
                    <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg border shadow-sm transition-transform group-hover:scale-110 ${tx.amount > 0.01 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-indigo-50 text-indigo-400 border-indigo-100'}`}>
                          <i className={`fa-solid ${tx.amount > 0.01 ? 'fa-crown' : 'fa-dollar-sign'}`}></i>
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900 tracking-tight">+${tx.amount.toFixed(3)} <span className="text-[10px] opacity-40 uppercase">USD</span></div>
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{tx.date.split(',')[0]}</div>
                        </div>
                      </div>
                      <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">SYNCED</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;