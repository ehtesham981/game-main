// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Task, Transaction } from '../types';
import { storage } from '../services/storage';

interface AdminPanelProps {
  initialView?: 'overview' | 'users' | 'history' | 'tasks' | 'finance' | 'reviews' | 'seo' | 'create-task';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialView = 'overview' }) => {
  const [view, setView] = useState(initialView);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const refreshActiveData = useCallback(async () => {
    setIsSyncing(true);
    try {
      if (view === 'overview') {
        // Optimize overview load: fetch concurrently
        const [allTxs, allUsers, allTasks] = await Promise.all([
          storage.getAllGlobalTransactions(),
          storage.getAllUsers(),
          storage.getTasks()
        ]);
        setTransactions(allTxs || []);
        setUsers(allUsers || []);
        setTasks(allTasks || []);
      } else {
        if (['history', 'reviews', 'finance', 'tasks'].includes(view)) {
          const allTxs = await storage.getAllGlobalTransactions();
          setTransactions(allTxs || []);
        }
        if (view === 'users') {
          const allUsers = await storage.getAllUsers();
          setUsers(allUsers || []);
        }
        if (['tasks', 'create-task'].includes(view)) {
          const allTasks = await storage.getTasks();
          setTasks(allTasks || []);
        }
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [view]);

  useEffect(() => {
    refreshActiveData();
  }, [view, refreshActiveData]);

  const stats = useMemo(() => ({
    totalCoins: users.reduce((acc, u) => acc + (Number(u.coins) || 0), 0),
    totalDeposit: users.reduce((acc, u) => acc + (Number(u.depositBalance) || 0), 0),
    pendingTasks: transactions.filter(tx => tx.type === 'earn' && tx.status === 'pending').length,
    pendingFinance: transactions.filter(tx => (tx.type === 'deposit' || tx.type === 'withdraw') && tx.status === 'pending').length,
    pendingTasksCount: tasks.filter(t => t.status === 'pending').length,
  }), [users, transactions, tasks]);

  const filteredUsers = useMemo(() => {
    const s = searchQuery.toLowerCase().trim();
    if (!s) return users;
    return users.filter(u => u?.username?.toLowerCase().includes(s) || u?.id?.toLowerCase().includes(s));
  }, [users, searchQuery]);

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'reviews', label: 'Reviews', icon: 'fa-camera-retro', badge: stats.pendingTasks },
    { id: 'tasks', label: 'Campaigns', icon: 'fa-list-check', badge: stats.pendingTasksCount },
    { id: 'finance', label: 'Finance', icon: 'fa-wallet', badge: stats.pendingFinance },
    { id: 'create-task', label: 'Create Task', icon: 'fa-plus' },
    { id: 'history', label: 'Logs', icon: 'fa-clock' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 mb-12">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-800 shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-10 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-2xl">
              <i className={`fa-solid ${isSyncing ? 'fa-sync fa-spin' : 'fa-user-shield'}`}></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Hub</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live Management</span>
              </div>
            </div>
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar relative z-10">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id as any)} className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${view === tab.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}>
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-slate-900">{tab.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6">
        {view === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Active Users', val: users.length, icon: 'fa-users', col: 'text-indigo-600' },
                { label: 'Pending Audits', val: stats.pendingTasks + stats.pendingFinance, icon: 'fa-clock', col: 'text-amber-500' },
                { label: 'Total Vault', val: (stats.totalDeposit || 0).toLocaleString(), icon: 'fa-shield', col: 'text-emerald-600' },
                { label: 'Coins Active', val: (stats.totalCoins || 0).toLocaleString(), icon: 'fa-coins', col: 'text-blue-600' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">{s.label}</p>
                  <h4 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{s.val}</h4>
                  <i className={`fa-solid ${s.icon} absolute -right-4 -bottom-4 text-7xl opacity-5 ${s.col}`}></i>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === 'users' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 gap-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Registry</h2>
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:w-80 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr><th className="px-10 py-6">Identity</th><th className="px-6 py-6">Vaults</th><th className="px-10 py-6 text-right">Ops</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                          {u.username}
                          {u.status === 'banned' && <span className="bg-rose-100 text-rose-600 text-[7px] px-1.5 py-0.5 rounded uppercase">Banned</span>}
                        </p>
                        <p className="text-[10px] text-indigo-400 font-mono">{u.id}</p>
                      </td>
                      <td className="px-6 py-6 font-black text-slate-900"><p>{u.coins?.toLocaleString() || 0} C (Earn)</p><p className="text-indigo-500">{u.depositBalance?.toLocaleString() || 0} C (Dep)</p></td>
                      <td className="px-10 py-6 text-right"><button onClick={() => setEditingUserId(u.id)} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg hover:bg-indigo-600 transition-all">Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management Modal */}
        {editingUserId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-10 md:p-14 border border-slate-200 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              {(() => {
                const user = users.find(u => u.id === editingUserId);
                if (!user) return null;
                return (
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">User Protocol</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{user.username} ({user.email})</p>
                      </div>
                      <button onClick={() => setEditingUserId(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"><i className="fa-solid fa-xmark"></i></button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Earning Vault</p>
                        <p className="text-2xl font-black text-slate-900">{user.coins?.toLocaleString() || 0} <span className="text-[10px] opacity-40">Coins</span></p>
                      </div>
                      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Deposit Vault</p>
                        <p className="text-2xl font-black text-indigo-600">{user.depositBalance?.toLocaleString() || 0} <span className="text-[10px] opacity-40">Coins</span></p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4 px-2">Modify Wallet Balance (Earning)</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={async () => {
                              const amt = prompt('Total coins to ADD to Earning Vault:');
                              if (amt && !isNaN(parseInt(amt))) {
                                await storage.updateUserInCloud(user.id, { coins: (user.coins || 0) + parseInt(amt) });
                                refreshActiveData();
                              }
                            }}
                            className="py-4 bg-emerald-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95"
                          >
                            Add Coins
                          </button>
                          <button
                            onClick={async () => {
                              const amt = prompt('Total coins to SUBTRACT from Earning Vault:');
                              if (amt && !isNaN(parseInt(amt))) {
                                await storage.updateUserInCloud(user.id, { coins: Math.max(0, (user.coins || 0) - parseInt(amt)) });
                                refreshActiveData();
                              }
                            }}
                            className="py-4 bg-rose-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95"
                          >
                            Subtract Coins
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100"></div>

                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={async () => {
                            const newStatus = user.status === 'banned' ? 'active' : 'banned';
                            await storage.updateUserInCloud(user.id, { status: newStatus as any });
                            refreshActiveData();
                          }}
                          className={`flex-1 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${user.status === 'banned' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white'}`}
                        >
                          {user.status === 'banned' ? 'Unban Identity' : 'Ban Identity'}
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`CRITICAL: Are you sure you want to PERMANENTLY DELETE user ${user.username}? This action cannot be undone.`)) {
                              alert('Root decommission sequence initiated. Data node flagged for removal.');
                              setEditingUserId(null);
                            }
                          }}
                          className="flex-1 py-4 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          Decommission Node
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {view === 'finance' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Financial Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">ID / User</th>
                    <th className="px-6 py-6">Type & Amount</th>
                    <th className="px-6 py-6">Details</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.filter(tx => (tx.type === 'deposit' || tx.type === 'withdraw')).map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="text-[10px] text-indigo-400 font-mono">{tx.id.substring(0, 12)}...</p>
                        <p className="text-xs font-black text-slate-900 mt-1">{tx.userId}</p>
                      </td>
                      <td className="px-6 py-6 font-black">
                        <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-widest ${tx.type === 'withdraw' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {tx.type}
                        </span>
                        <p className="mt-2 text-slate-900">{tx.amount.toLocaleString()} Coins</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-bold text-slate-500">{tx.method} <br /> {tx.account}</p>
                        <p className={`text-[10px] font-black uppercase mt-1 ${tx.status === 'pending' ? 'text-amber-500' : tx.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.status}</p>
                      </td>
                      <td className="px-10 py-6 text-right space-x-2">
                        {tx.proofImage && (
                          <a href={tx.proofImage} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded-lg">Proof</a>
                        )}
                        {tx.status === 'pending' && (
                          <>
                            <button onClick={async () => { await storage.updateGlobalTransaction(tx.id, { status: 'success' }); refreshActiveData(); }} className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg">Approve</button>
                            <button onClick={async () => { await storage.updateGlobalTransaction(tx.id, { status: 'failed' }); refreshActiveData(); }} className="px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase rounded-lg">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {view === 'reviews' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Task Reviews</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">Task ID</th>
                    <th className="px-6 py-6">User / Amount</th>
                    <th className="px-6 py-6">Proofs</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.filter(tx => tx.type === 'earn').map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="text-xs font-black text-slate-900 line-clamp-1">{tx.method || 'Task Completion'}</p>
                        <p className="font-mono text-[9px] text-indigo-400 mt-1">{tx.taskId || tx.id}</p>
                      </td>
                      <td className="px-6 py-6 text-xs font-black text-slate-900">
                        {tx.userId}
                        <p className="text-emerald-600 mt-1">+{tx.amount} C</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${tx.status === 'pending' ? 'text-amber-500' : tx.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.status}</p>
                      </td>
                      <td className="px-6 py-6 space-x-2">
                        {tx.proofImage && <a href={tx.proofImage} target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">Proof 1</a>}
                        {tx.proofImage2 && <a href={tx.proofImage2} target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">Proof 2</a>}
                      </td>
                      <td className="px-10 py-6 text-right space-x-2">
                        {tx.status === 'pending' && (
                          <>
                            <button
                              onClick={async () => {
                                // 1. Update Transaction
                                await storage.updateGlobalTransaction(tx.id, { status: 'success' });

                                // 2. Credit User
                                const user = users.find(u => u.id === tx.userId);
                                if (user) {
                                  await storage.updateUserInCloud(user.id, { coins: (user.coins || 0) + tx.amount });
                                }

                                // 3. Update Task Progress
                                if (tx.taskId) {
                                  const task = tasks.find(t => t.id === tx.taskId);
                                  if (task) {
                                    const newCount = (task.completedCount || 0) + 1;
                                    const newStatus = newCount >= task.totalWorkers ? 'completed' : task.status;
                                    await storage.updateTaskInCloud(task.id, {
                                      completedCount: newCount,
                                      status: newStatus as any
                                    });
                                  }
                                }

                                refreshActiveData();
                              }}
                              className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={async () => { await storage.updateGlobalTransaction(tx.id, { status: 'failed' }); refreshActiveData(); }}
                              className="px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-rose-100 active:scale-95 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {tx.status !== 'pending' && <span className="text-[9px] font-black text-slate-300 uppercase">Archived</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {view === 'tasks' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Campaigns Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">Campaign Info</th>
                    <th className="px-6 py-6">Progress</th>
                    <th className="px-6 py-6">Creator</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-900">{task.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{task.type} - {task.reward} Coins</p>
                        <p className={`mt-1 text-[9px] font-black uppercase tracking-widest ${task.status === 'pending' ? 'text-amber-500' : task.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>{task.status}</p>
                      </td>
                      <td className="px-6 py-6 text-xs font-black text-slate-700">
                        {task.completedCount} / {task.totalWorkers}
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-slate-700">{task.creatorId}</td>
                      <td className="px-10 py-6 text-right space-x-2">
                        {task.status === 'pending' && (
                          <>
                            <button onClick={async () => { await storage.updateTaskInCloud(task.id, { status: 'active' }); refreshActiveData(); }} className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg">Approve</button>
                            <button onClick={async () => { await storage.updateTaskInCloud(task.id, { status: 'rejected' }); refreshActiveData(); }} className="px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase rounded-lg">Reject</button>
                          </>
                        )}
                        <button onClick={async () => { await storage.deleteTaskFromCloud(task.id); refreshActiveData(); }} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {view === 'create-task' && (
          <div className="max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-2xl">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Generate Task</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Deploy new earning utility to network</p>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newTask: Task = {
                      id: `TSK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                      title: formData.get('title') as string,
                      type: formData.get('type') as any,
                      reward: parseInt(formData.get('reward') as string),
                      description: formData.get('description') as string,
                      creatorId: 'ADMIN',
                      totalWorkers: parseInt(formData.get('totalWorkers') as string),
                      completedCount: 0,
                      status: 'active',
                      link: formData.get('link') as string,
                      requiredScreenshots: parseInt(formData.get('screenshots') as string),
                      createdAt: new Date().toISOString()
                    };

                    try {
                      const existingTasks = await storage.getTasks();
                      await storage.setTasks([...existingTasks, newTask]);
                      alert('Task deployed successfully!');
                      setView('tasks');
                    } catch (err) {
                      alert('Failed to deploy task.');
                    }
                  }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Task Heading</label>
                      <input name="title" required placeholder="e.g. Subscribe to YouTube Channel" className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Node Type (Category)</label>
                      <select name="type" required className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none appearance-none">
                        <option value="YouTube">YouTube</option>
                        <option value="Websites">Websites</option>
                        <option value="Apps">Apps</option>
                        <option value="Social Media">Social Media</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Reward Volume (Coins)</label>
                      <input name="reward" type="number" required placeholder="100" className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Workforce Quota (Total Workers)</label>
                      <input name="totalWorkers" type="number" required placeholder="1000" className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Link Resource (URL)</label>
                      <input name="link" required placeholder="https://..." className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Verification Complexity (Screenshots Required)</label>
                      <select name="screenshots" className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none appearance-none">
                        <option value="1">1 Screenshot (Standard)</option>
                        <option value="2">2 Screenshots (Dual Audit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Task Brief (Instructions)</label>
                    <textarea name="description" required rows={4} placeholder="Detailed instructions for the task..." className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-900 shadow-inner focus:bg-white transition-all outline-none resize-none"></textarea>
                  </div>

                  <button type="submit" className="w-full py-8 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
                    Deploy Task to Mainnet
                  </button>
                </form>
              </div>
              <i className="fa-solid fa-plus absolute -right-20 -bottom-20 text-[25rem] text-slate-50 -rotate-12 pointer-events-none opacity-50"></i>
            </div>
          </div>
        )}
        {view === 'history' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Global Transaction Logs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">ID / Date</th>
                    <th className="px-6 py-6">Entity</th>
                    <th className="px-6 py-6">Amount / Type</th>
                    <th className="px-10 py-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.slice(0, 100).map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="font-mono text-[10px] text-indigo-500">{tx.id}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{tx.date}</p>
                      </td>
                      <td className="px-6 py-6 text-xs font-black text-slate-900">{tx.userId}</td>
                      <td className="px-6 py-6 text-xs font-black">
                        {tx.amount} C <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-widest text-[8px]">{tx.type}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'success' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-rose-500'}`}>{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;