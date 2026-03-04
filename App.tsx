import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { User, Task, Transaction } from './types';
import { storage } from './services/storage';
import AdminPanel from './pages/AdminPanel';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const SpinWheel = lazy(() => import('./pages/SpinWheel'));
const Referrals = lazy(() => import('./pages/Referrals'));
const Tasks = lazy(() => import('./pages/Tasks'));
const CreateTask = lazy(() => import('./pages/CreateTask'));
const MathSolver = lazy(() => import('./pages/MathSolver'));
const MyCampaigns = lazy(() => import('./pages/MyCampaigns'));
const Features = lazy(() => import('./pages/Features'));
const Contact = lazy(() => import('./pages/Contact'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const FreelanceFigma = lazy(() => import('./pages/FreelanceFigma'));
const Advertise = lazy(() => import('./pages/Advertise'));
const MicroJobs = lazy(() => import('./pages/MicroJobs'));
const WeeklyBonus = lazy(() => import('./pages/WeeklyBonus'));


const PageLoader = () => (
  <div className="min-h-[40vh] w-full flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState<User>({ ...storage.getUser(), isLoggedIn: true });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(storage.getTransactions());
  const [sessionConflict, setSessionConflict] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const referralId = urlParams.get('id');
      if (referralId) {
        sessionStorage.setItem('pending_referral', referralId);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      try {
        const initialTasks = await storage.getTasks();
        setTasks(initialTasks);

        if (user.isLoggedIn) {
          const cloudUser = await storage.syncUserFromCloud(user.id);
          if (cloudUser) {
            const localSessionId = localStorage.getItem('ct_user_session_id');
            if (cloudUser.currentSessionId && localSessionId && cloudUser.currentSessionId !== localSessionId) {
              setSessionConflict(true);
              handleLogout();
              return;
            }
            setUser(cloudUser);
            const userTxs = await storage.getUserTransactions(user.id);
            setTransactions(userTxs);
          }
        }

        const seo = await storage.getSEOConfig();
        document.title = seo.siteTitle;
      } catch (error) {
        console.error("Sync error:", error);
      }
    };
    initApp();
  }, []);

  const handleLogout = useCallback(() => {
    const guestUser: User = {
      id: storage.getUserId(),
      username: 'Guest',
      email: '',
      coins: 0,
      depositBalance: 0,
      completedTasks: [],
      createdTasks: [],
      isLoggedIn: false
    };
    setUser(guestUser);
    setCurrentPage('home');
    localStorage.removeItem('ct_user_session_id');
    localStorage.removeItem('ct_user');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const refreshUserBalance = useCallback(async (userId?: string) => {
    const idToSync = userId || user.id;
    const cloudUser = await storage.syncUserFromCloud(idToSync);
    if (cloudUser) {
      setUser(cloudUser);
      const userTxs = await storage.getUserTransactions(idToSync);
      setTransactions(userTxs);
    }
  }, [user.id]);

  const handleLogin = async (userData: any) => {
    const newSessionId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ct_user_session_id', newSessionId);
    const cloudUser = await storage.syncUserFromCloud(userData.id);
    const updatedUser: User = {
      ...userData,
      ...(cloudUser || {}),
      isLoggedIn: true,
      currentSessionId: newSessionId,
    };
    setUser(updatedUser);
    await storage.setUser(updatedUser);
    setCurrentPage(updatedUser.isAdmin ? 'admin-overview' : 'dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWalletAction = async (type: 'deposit' | 'withdraw', amt: number, meth: string, acc?: string, proof?: string) => {
    const tx: Transaction = {
      id: `FIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
      userId: user.id,
      amount: amt,
      type: type,
      method: meth,
      account: acc,
      proofImage: proof,
      status: 'pending',
      date: new Date().toLocaleString()
    };
    if (type === 'withdraw') {
      const updatedUser = { ...user, coins: user.coins - amt };
      await storage.setUser(updatedUser);
      setUser(updatedUser);
    }
    await storage.addTransaction(tx);
  };

  const handleClaimReferral = async (referredUserId: string) => {
    const freshUser = await storage.syncUserFromCloud(user.id);
    const currentUser = freshUser || user;

    if (currentUser.claimedReferrals?.includes(referredUserId)) return;

    const REWARD = referredUserId === 'milestone_5_bonus' ? 200 : (referredUserId === 'milestone_3_bonus' ? 150 : 50);
    const updatedUser: User = {
      ...currentUser,
      coins: currentUser.coins + REWARD,
      claimedReferrals: [...(currentUser.claimedReferrals || []), referredUserId]
    };

    setUser(updatedUser);
    await storage.setUser(updatedUser);

    const tx: Transaction = {
      id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
      userId: currentUser.id,
      amount: REWARD,
      type: 'referral_claim',
      method: 'Referral Bonus',
      status: 'success',
      date: new Date().toLocaleString()
    };
    await storage.addTransaction(tx);
    await refreshUserBalance();
  };

  const handleClaimWeeklyBonus = async (reward: number) => {
    const now = Date.now();
    const updatedUser: User = {
      ...user,
      coins: user.coins + reward,
      lastWeeklyBonusClaim: now
    };
    setUser(updatedUser);
    await storage.setUser(updatedUser);

    const tx: Transaction = {
      id: `WKB-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${now}`,
      userId: user.id,
      amount: reward,
      type: 'weekly_bonus',
      method: 'Weekly Bonus Claim',
      status: 'success',
      date: new Date().toLocaleString()
    };
    await storage.addTransaction(tx);
    await refreshUserBalance();
  };

  const handleCreateTask = async (taskData: any) => {
    const totalCost = taskData.reward * taskData.totalWorkers;

    if (user.depositBalance < totalCost) {
      alert("Insufficient deposit balance!");
      return;
    }

    const newTask: Task = {
      id: `TSK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...taskData,
      creatorId: user.id,
      completedCount: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      depositBalance: user.depositBalance - totalCost,
      createdTasks: [...(user.createdTasks || []), newTask.id]
    };

    const tx: Transaction = {
      id: `CAM-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
      userId: user.id,
      taskId: newTask.id,
      amount: totalCost,
      type: 'spend',
      method: `Campaign: ${newTask.title}`,
      status: 'success',
      date: new Date().toLocaleString()
    };

    try {
      // 1. Update user
      setUser(updatedUser);
      await storage.setUser(updatedUser);

      // 2. Add transaction
      await storage.addTransaction(tx);

      // 3. Save new task
      const currentTasks = await storage.getTasks();
      const updatedTasks = [newTask, ...currentTasks];
      storage.setTasks(updatedTasks);

      // 4. Update local state
      setTasks(updatedTasks);

      alert("Campaign launched successfully!");
      navigateTo('my-campaigns');
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to launch campaign. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await storage.deleteTaskFromCloud(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      alert("Campaign terminated and removed.");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete campaign.");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await storage.updateTaskInCloud(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
      alert("Campaign specifications updated.");
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update campaign.");
    }
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentPage={currentPage} setCurrentPage={navigateTo} user={user} onLogout={handleLogout} />

      {sessionConflict && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 text-center">
          <div className="bg-white p-12 rounded-[3rem] max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Access Terminated</h2>
            <p className="text-slate-500 font-bold text-sm mb-8">Dual session detected.</p>
            <button onClick={() => { setSessionConflict(false); setCurrentPage('login'); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">Reconnect</button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          {currentPage === 'home' && <Home onStart={navigateTo} isLoggedIn={user.isLoggedIn} />}
          {currentPage === 'features' && <Features />}
          {currentPage === 'contact' && <Contact />}
          {currentPage === 'wallet' && <Wallet coins={user.coins} depositBalance={user.depositBalance} onAction={handleWalletAction} transactions={transactions} onRefresh={() => refreshUserBalance()} onNavigate={navigateTo} />}
          {currentPage === 'dashboard' && user.isLoggedIn && <Dashboard user={user} tasks={tasks} transactions={transactions} onDeleteTask={() => { }} onUpdateTask={() => { }} />}
          {currentPage === 'micro-jobs' && user.isLoggedIn && <MicroJobs user={user} onNavigate={navigateTo} />}
          {currentPage === 'weekly-bonus' && user.isLoggedIn && (
            <WeeklyBonus
              user={user}
              transactions={transactions}
              onClaim={handleClaimWeeklyBonus}
              onBack={() => navigateTo('micro-jobs')}
              onNavigate={navigateTo}
            />
          )}
          {currentPage === 'tasks' && user.isLoggedIn && (
            <Tasks
              user={user}
              tasks={tasks}
              transactions={transactions}
              navigateTo={navigateTo}
              onComplete={async (taskId, img1, img2, date, msg) => {
                const task = tasks.find(t => t.id === taskId);
                if (!task) return;

                const tx: Transaction = {
                  id: `TASK-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
                  userId: user.id,
                  taskId: taskId,
                  amount: task.reward,
                  type: 'earn',
                  method: `${task.type} | ${task.title}`,
                  proofImage: img1,
                  proofImage2: img2,
                  message: msg,
                  status: 'pending',
                  date: date || new Date().toLocaleString()
                };

                const updatedUser = {
                  ...user,
                  completedTasks: [...(user.completedTasks || []), taskId]
                };

                await storage.addTransaction(tx);
                await storage.setUser(updatedUser);
                setUser(updatedUser);
                await refreshUserBalance();
              }}
            />
          )}
          {currentPage === 'advertise' && user.isLoggedIn && <Advertise user={user} onRefresh={() => refreshUserBalance()} onNavigate={navigateTo} />}
          {currentPage === 'create-task' && user.isLoggedIn && (
            <CreateTask
              user={user}
              tasks={tasks}
              userDepositBalance={user.depositBalance}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onCreate={handleCreateTask}
              navigateTo={navigateTo}
            />
          )}
          {currentPage === 'my-campaigns' && user.isLoggedIn && (
            <MyCampaigns
              user={user}
              tasks={tasks}
              transactions={transactions}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onNavigate={navigateTo}
            />
          )}
          {currentPage === 'math-solver' && user.isLoggedIn && (
            <MathSolver
              user={user}
              transactions={transactions}
              onBack={() => navigateTo('dashboard')}
              onSolve={async (reward: number, isLast: boolean) => {
                const updatedUser = {
                  ...user,
                  coins: user.coins + reward,
                  ...(isLast ? { lastMathTimestamp: Date.now() } : {})
                };
                setUser(updatedUser);
                await storage.setUser(updatedUser);

                const tx: Transaction = {
                  id: `MATH-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
                  userId: user.id,
                  amount: reward,
                  type: 'math_reward',
                  method: 'Math Solver',
                  status: 'success',
                  date: new Date().toLocaleString()
                };
                await storage.addTransaction(tx);
                await refreshUserBalance();
              }}
            />
          )}
          {currentPage === 'login' && <Login onLogin={handleLogin} />}
          {currentPage === 'spin' && user.isLoggedIn && (
            <SpinWheel
              userCoins={user.coins}
              onSpin={async (w: number, c: number) => {
                const updatedUser = { ...user, coins: user.coins + w - c };
                setUser(updatedUser);
                await storage.setUser(updatedUser);

                if (w > 0 || c > 0) {
                  const tx: Transaction = {
                    id: `SPIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
                    userId: user.id,
                    amount: w - c,
                    type: 'spin',
                    method: 'Spin Wheel',
                    status: 'success',
                    date: new Date().toLocaleString()
                  };
                  await storage.addTransaction(tx);
                }
                await refreshUserBalance();
              }}
              transactions={transactions}
              onNavigate={navigateTo}
            />
          )}
          {currentPage === 'referrals' && user.isLoggedIn && <Referrals user={user} onClaim={handleClaimReferral} onNavigate={navigateTo} />}
          {currentPage === 'profile' && user.isLoggedIn && <ProfileSettings user={user} onNavigate={navigateTo} />}
          {currentPage === 'privacy-policy' && <PrivacyPolicy />}
          {currentPage === 'terms-conditions' && <TermsConditions />}
          {currentPage === 'disclaimer' && <Disclaimer />}
          {currentPage === 'freelance-figma' && user.isLoggedIn && (
            <FreelanceFigma
              user={user}
              tasks={tasks}
              onBack={() => navigateTo('dashboard')}
              onUpdateUser={async (updatedData: Partial<User>) => {
                const updatedUser = { ...user, ...updatedData };
                setUser(updatedUser);
                await storage.setUser(updatedUser);
                await refreshUserBalance();
              }}
              onComplete={async (taskId, img1, img2, date, msg) => {
                const task = tasks.find(t => t.id === taskId);
                if (!task) return;

                const tx: Transaction = {
                  id: `TASK-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
                  userId: user.id,
                  taskId: taskId,
                  amount: task.reward,
                  type: 'earn',
                  method: `${task.type} | ${task.title}`,
                  proofImage: img1,
                  proofImage2: img2,
                  message: msg,
                  status: 'pending',
                  date: date || new Date().toLocaleString()
                };

                const updatedUser = {
                  ...user,
                  completedTasks: [...(user.completedTasks || []), taskId]
                };

                await storage.addTransaction(tx);
                await storage.setUser(updatedUser);
                setUser(updatedUser);
                await refreshUserBalance();
              }}
            />
          )}

          {currentPage.startsWith('admin-') && user.isAdmin && <AdminPanel initialView={currentPage.slice(6) as any} onNavigate={navigateTo} />}
        </Suspense>
      </main>
      <Footer setCurrentPage={navigateTo} isLoggedIn={user.isLoggedIn} />
    </div>
  );
};

export default App;