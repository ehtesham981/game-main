import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, Task, TaskType } from '../types';
import BackToDashboard from '../components/BackToDashboard';

interface FreelanceFigmaProps {
    user: User;
    tasks: Task[];
    onBack: () => void;
    onUpdateUser: (data: Partial<User>) => Promise<void>;
    onComplete: (taskId: string, img1?: string, img2?: string, date?: string, msg?: string) => Promise<void>;
}

const FreelanceFigma: React.FC<FreelanceFigmaProps> = ({ user, tasks, onBack, onUpdateUser, onComplete }) => {
    const [isClient, setIsClient] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Task Submission States
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSubmittingProof, setIsSubmittingProof] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [textProof1, setTextProof1] = useState('');
    const [textProof2, setTextProof2] = useState('');
    const [textProof3, setTextProof3] = useState('');
    const [pdfProof, setPdfProof] = useState<string | null>(null);
    const [pdfName, setPdfName] = useState<string | null>(null);

    const pdfInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const categories = [
        {
            id: 'Content Writing',
            title: 'Content Writing',
            icon: 'fa-pen-nib',
            color: 'bg-emerald-500',
            desc: 'Draft high-impact articles, ad copy, and technical documentation.',
            yield: '$0.02738 USD/Task'
        },
        {
            id: 'Graphics Designing',
            title: 'Graphics Designing',
            icon: 'fa-palette',
            color: 'bg-indigo-500',
            desc: 'Create branding, social media assets, and professional UI mockups.',
            yield: '$0.02738 USD/Task'
        },
        {
            id: 'Blog Development',
            title: 'Blog Development',
            icon: 'fa-laptop-code',
            color: 'bg-amber-500',
            desc: 'Configure and deploy SEO-optimized WordPress/Next.js blogs.',
            yield: '$0.02738 USD/Task'
        },
        {
            id: 'SEO',
            title: 'SEO Specialist',
            icon: 'fa-arrow-up-right-dots',
            color: 'bg-rose-500',
            desc: 'Optimize site rankings through backlink audits and technical SEO.',
            yield: '$0.02738 USD/Task'
        }
    ];

    const currentCategory = useMemo(() => categories.find(c => c.id === activeCategory), [activeCategory]);

    const activeTasks = useMemo(() => {
        if (!activeCategory) return [];
        return tasks.filter(t => t.type === activeCategory && t.status === 'active' && !user.completedTasks?.includes(t.id));
    }, [tasks, activeCategory, user.completedTasks]);

    const completedTasks = useMemo(() => {
        const freelanceTypes = ['Content Writing', 'Graphics Designing', 'Blog Development', 'SEO'];
        return tasks.filter(t => freelanceTypes.includes(t.type) && user.completedTasks?.includes(t.id));
    }, [tasks, user.completedTasks]);

    const handleInitialize = async () => {
        setIsInitializing(true);
        const newId = 'FL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setTimeout(async () => {
            await onUpdateUser({ freelanceId: newId });
            setIsInitializing(false);
        }, 1500);
    };

    const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                return alert("Please upload a PDF file.");
            }
            if (file.size > 2 * 1024 * 1024) {
                return alert("PDF size must be under 2MB.");
            }

            setPdfName(file.name);
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = (upload) => {
                setPdfProof(upload.target?.result as string);
                setIsUploading(false);
            };
            reader.onerror = () => {
                alert("Failed to process PDF.");
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinalSubmit = async () => {
        if (!selectedTask) return;

        if (!textProof1 || !textProof2) {
            return alert("Please fill at least the first two text proof fields.");
        }

        if (!pdfProof) {
            return alert("Please upload the required PDF proof.");
        }

        setIsUploading(true);
        try {
            const combinedMessage = `Text Proof 1: ${textProof1}\nText Proof 2: ${textProof2}\nText Proof 3: ${textProof3}\n\nUser Message: ${submissionMessage}`;
            await onComplete(selectedTask.id, pdfProof || undefined, undefined, new Date().toLocaleString(), combinedMessage);
            setSelectedTask(null);
            setIsSubmittingProof(false);
            setTextProof1('');
            setTextProof2('');
            setTextProof3('');
            setPdfProof(null);
            setPdfName(null);
            setSubmissionMessage('');
            alert("Application submitted for review!");
        } catch (err) {
            alert("Submission failed.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isClient) return null;

    if (!user.freelanceId) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8">
                    <BackToDashboard onNavigate={onBack} />
                    <div className="max-w-2xl mx-auto text-center mt-12 bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl">
                            <i className={`fa-solid ${isInitializing ? 'fa-spinner fa-spin' : 'fa-id-card-clip'} text-4xl`}></i>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                            Freelance <span className="text-indigo-600">Gateway</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-sm md:text-lg mb-12 leading-relaxed">
                            To participate in our premium high-yield freelance network, you must first initialize your unique contractor identity and join the verified talent pool.
                        </p>
                        <button
                            onClick={handleInitialize}
                            disabled={isInitializing}
                            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isInitializing ? 'Generating Node Identity...' : 'Generate Identity ID'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-12 animate-in fade-in duration-700">

                <BackToDashboard onNavigate={onBack} />

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
                        {activeCategory ? (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setActiveCategory(null)}
                                            className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                                        >
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{currentCategory?.title} Jobs</h2>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global active assignments</p>
                                        </div>
                                    </div>
                                    <div className={`w-14 h-14 ${currentCategory?.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                                        <i className={`fa-solid ${currentCategory?.icon}`}></i>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {activeTasks.length > 0 ? activeTasks.map((job) => (
                                        <div key={job.id} onClick={() => setSelectedTask(job)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    <i className="fa-solid fa-briefcase"></i>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 mb-1">{job.title}</h4>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">ID: {job.id}</span>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Node</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Potential Yield</p>
                                                    <p className="text-xl font-black text-indigo-600">${job.reward.toFixed(3)} <span className="text-[10px] uppercase">USD</span></p>
                                                </div>
                                                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                                                    Enter Node
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                            <i className="fa-solid fa-folder-open text-5xl text-slate-100 mb-4 block"></i>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No active nodes in this sector</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
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
                                                <button
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-indigo-600 transition-colors shadow-lg"
                                                >
                                                    Access Node
                                                </button>
                                            </div>
                                            <div className={`absolute -right-8 -bottom-8 text-8xl ${cat.color} opacity-5 -rotate-12 transition-transform group-hover:scale-110`}>
                                                <i className={`fa-solid ${cat.icon}`}></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Project History Section */}
                        <div className="pt-10 border-t border-slate-200/60 mt-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Project History</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chronicle of your completed assignments</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Verified Projects: {completedTasks.length}</span>
                                    </div>
                                </div>
                            </div>

                            {completedTasks.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {completedTasks.map((project) => (
                                        <div key={project.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-emerald-100/50">
                                                    <i className="fa-solid fa-check-double"></i>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-lg font-black text-slate-900">{project.title}</h4>
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-full">{project.type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Job ID: {project.id}</span>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                                            <i className="fa-solid fa-shield-check"></i>
                                                            Payout Secured
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Earnings</p>
                                                    <p className="text-xl font-black text-emerald-600">+${project.reward.toFixed(3)} <span className="text-[10px] uppercase">USD</span></p>
                                                </div>
                                                <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                    Archived
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                        <i className="fa-solid fa-scroll text-3xl"></i>
                                    </div>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No project records found in this ID</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-2 max-w-[250px] mx-auto">Complete your first assignment to initialize your career log.</p>
                                </div>
                            )}
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
                                    <p className="mt-4 text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">Authorize tasks to progress rank</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Projects</p>
                                        <p className="text-2xl font-black text-slate-900">{user.completedTasks?.length || 0}</p>
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

            {/* Task Detail & Verification Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] md:rounded-[4rem] shadow-3xl overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 ${currentCategory?.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                                    <i className={`fa-solid ${currentCategory?.icon}`}></i>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{selectedTask.title}</h3>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Yield: ${selectedTask.reward.toFixed(3)} USD</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="w-12 h-12 bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        <div className="p-8 md:p-10 overflow-y-auto no-scrollbar space-y-8 flex-grow">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-mono">Mission Resource</label>
                                <a href={selectedTask.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl hover:bg-indigo-600 transition-all group shadow-xl">
                                    <span className="text-xs font-black truncate max-w-[80%] opacity-80">{selectedTask.link}</span>
                                    <i className="fa-solid fa-arrow-up-right-from-square group-hover:scale-110 transition-transform"></i>
                                </a>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-mono">Mission Brief</label>
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line shadow-inner">
                                    {selectedTask.description}
                                </div>
                            </div>

                            {isSubmittingProof ? (
                                <div className="space-y-8 animate-in slide-in-from-bottom-6">
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-4 block font-mono text-center">Verification Data Required</label>

                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={textProof1}
                                                    onChange={e => setTextProof1(e.target.value)}
                                                    placeholder="Enter Text Proof 1 (Required)"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={textProof2}
                                                    onChange={e => setTextProof2(e.target.value)}
                                                    placeholder="Enter Text Proof 2 (Required)"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={textProof3}
                                                    onChange={e => setTextProof3(e.target.value)}
                                                    placeholder="Enter Text Proof 3 (Optional)"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-4 block mb-4 font-mono">PDF Submission Section</label>
                                            <input type="file" ref={pdfInputRef} onChange={handlePdfChange} className="hidden" accept="application/pdf" />
                                            <button
                                                onClick={() => pdfInputRef.current?.click()}
                                                className={`w-full py-10 rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center gap-4 transition-all ${pdfProof ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600' : 'border-slate-100 bg-slate-50 text-slate-300 hover:border-indigo-400 hover:text-indigo-400'}`}
                                            >
                                                {isUploading ? <i className="fa-solid fa-spinner fa-spin text-2xl"></i> : <i className={`fa-solid ${pdfProof ? 'fa-file-pdf' : 'fa-cloud-arrow-up'} text-3xl`}></i>}
                                                <div className="text-center">
                                                    <span className="text-[9px] font-black uppercase tracking-widest block">{pdfProof ? 'PDF Document Attached' : 'Upload Final PDF Report'}</span>
                                                    {pdfName && <span className="text-[8px] font-mono opacity-60 mt-1 block">{pdfName}</span>}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-4 block font-mono">Submission Note</label>
                                        <textarea value={submissionMessage} onChange={e => setSubmissionMessage(e.target.value)} placeholder="Attach additional comments or notes..." className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition-all min-h-[140px] resize-none outline-none shadow-inner" />
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setIsSubmittingProof(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 font-black rounded-3xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Backtrack</button>
                                        <button onClick={handleFinalSubmit} disabled={!textProof1 || !textProof2 || !pdfProof || isUploading} className="flex-[2] py-6 bg-slate-900 text-white font-black rounded-3xl text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95">
                                            {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-terminal"></i> Submit Project</>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setIsSubmittingProof(true)} className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-4">
                                    Initialize Audit Sequence <i className="fa-solid fa-bolt"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default FreelanceFigma;
