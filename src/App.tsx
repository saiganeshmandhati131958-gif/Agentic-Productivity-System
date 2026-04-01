import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Clock,
  AlertCircle,
  ChevronRight,
  Cpu,
  Database,
  Layers,
  Zap,
  User,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Task {
  id: string;
  title: string;
  deadline: string;
  difficulty: number;
  status: 'pending' | 'completed';
}

interface Event {
  id: string;
  title: string;
  time: string;
  type: 'class' | 'meeting' | 'study';
}

interface ExecutionStep {
  agent: string;
  status: 'pending' | 'active' | 'completed';
  message: string;
  timestamp?: string;
  decision?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agents?: string[];
  steps?: ExecutionStep[];
}

// --- Components ---

const ExecutionTrace = ({ steps }: { steps: ExecutionStep[] }) => (
  <div className="bg-slate-900/5 rounded-xl p-4 border border-slate-200/50 space-y-4">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Execution Trace</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
    </div>
    {steps.map((step, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-3 relative"
      >
        {i < steps.length - 1 && (
          <div className="absolute left-[3px] top-4 w-[1px] h-full bg-slate-200"></div>
        )}
        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 z-10 ${
          step.status === 'completed' ? 'bg-emerald-500' : step.status === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'
        }`}></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{step.agent}</p>
            {step.timestamp && (
              <span className="text-[9px] text-slate-400 font-mono">
                {new Date(step.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{step.message}</p>
          {step.decision && (
            <div className="mt-1.5 bg-white/50 p-2 rounded-lg border border-slate-100">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">Decision</p>
              <p className="text-[10px] text-slate-500 italic leading-tight">{step.decision}</p>
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const BentoCard = ({ children, title, icon: Icon, className = "" }: { children: React.ReactNode, title: string, icon: any, className?: string }) => (
  <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-slate-50 rounded-lg text-indigo-600">
          <Icon size={18} />
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <Plus size={18} />
      </button>
    </div>
    {children}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your Student Productivity OS. I've synced your Google Calendar and AlloyDB tasks. How can I help you optimize your week?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<ExecutionStep[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, currentSteps]);

  const simulateSteps = async (steps: any[]) => {
    setCurrentSteps([]);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentSteps(prev => [...prev, { ...step, status: 'active' }]);
      await new Promise(r => setTimeout(r, 600));
      setCurrentSteps(prev => {
        const newSteps = [...prev];
        newSteps[i] = { ...step, status: 'completed' };
        return newSteps;
      });
    }
    await new Promise(r => setTimeout(r, 400));
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideMsg?: string) => {
    if (e) e.preventDefault();
    const userMsg = overrideMsg || input;
    if (!userMsg.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    setCurrentSteps([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (data.steps) {
        await simulateSteps(data.steps);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        agents: data.agents_involved,
        steps: data.steps
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
      setCurrentSteps([]);
    }
  };

  const runDemoStory = () => {
    handleSendMessage(undefined, "I have an OS exam next Friday, 3 pending assignments, and a project meeting Tuesday. Help me plan my week.");
  };

  const tasks: Task[] = [
    { id: '1', title: 'OS Assignment 1', deadline: 'Wed, 2 PM', difficulty: 4, status: 'pending' },
    { id: '2', title: 'Database Project', deadline: 'Fri, 11 PM', difficulty: 5, status: 'pending' },
    { id: '3', title: 'Math Quiz Prep', deadline: 'Mon, 9 AM', difficulty: 3, status: 'pending' },
  ];

  const events: Event[] = [
    { id: '1', title: 'Project Meeting', time: 'Tue, 2:00 PM', type: 'meeting' },
    { id: '2', title: 'OS Lecture', time: 'Wed, 10:00 AM', type: 'class' },
    { id: '3', title: 'Study Block', time: 'Thu, 4:00 PM', type: 'study' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Zap size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Student OS</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Calendar} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          <SidebarItem icon={CheckSquare} label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <SidebarItem icon={BookOpen} label="Knowledge" active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} />
          <SidebarItem icon={Layers} label="Architecture" active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">Demo Student</p>
              <p className="text-xs text-slate-400">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full w-96 border border-slate-100">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search tasks, notes, or agents..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Settings size={20} />
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus size={18} />
              New Entry
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-12 gap-6"
              >
                {/* Welcome Section */}
                <div className="col-span-12 mb-2">
                  <h2 className="text-3xl font-bold text-slate-800">Welcome back, Alex! 👋</h2>
                  <p className="text-slate-500 mt-1">You have 3 deadlines approaching and a project meeting in 4 hours.</p>
                </div>

                {/* AI Chat Assistant - Large Card */}
                <BentoCard title="AI Orchestrator" icon={Cpu} className="col-span-8 row-span-2 flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {messages.length === 1 && (
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-4">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Hackathon Demo Mode</p>
                        <p className="text-sm text-indigo-900 mb-3">Experience the full multi-agent orchestration by running the "OS Exam" scenario.</p>
                        <button 
                          onClick={runDemoStory}
                          className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Zap size={16} fill="currentColor" />
                          Run OS Exam Story
                        </button>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${
                          msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          {msg.agents && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.agents.map(agent => (
                                <span key={agent} className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-1 rounded-md flex items-center gap-1">
                                  <Zap size={10} /> {agent}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {msg.steps && msg.role === 'assistant' && (
                          <div className="mt-2 w-[85%]">
                            <ExecutionTrace steps={msg.steps} />
                          </div>
                        )}
                      </div>
                    ))}
                    {currentSteps.length > 0 && (
                      <div className="flex flex-col items-start w-[85%]">
                        <ExecutionTrace steps={currentSteps} />
                      </div>
                    )}
                    {isTyping && currentSteps.length === 0 && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask your assistant to plan your week..." 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button type="submit" className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </BentoCard>

                {/* Upcoming Schedule */}
                <BentoCard title="Today's Schedule" icon={Calendar} className="col-span-4">
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className={`w-2 h-10 rounded-full ${
                          event.type === 'meeting' ? 'bg-amber-400' : event.type === 'class' ? 'bg-indigo-400' : 'bg-emerald-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{event.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> {event.time}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                      </div>
                    ))}
                  </div>
                </BentoCard>

                {/* Pending Tasks */}
                <BentoCard title="Priority Tasks" icon={CheckSquare} className="col-span-4">
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 border border-slate-50 rounded-xl">
                        <div className="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-0.5">Due {task.deadline}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1 h-3 rounded-full ${i < task.difficulty ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </BentoCard>

                {/* System Health / Stats */}
                <div className="col-span-12 grid grid-cols-4 gap-6 mt-2">
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
                      <Database size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AlloyDB AI</p>
                      <p className="text-lg font-bold text-indigo-900">128 Notes Indexed</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">MCP Status</p>
                      <p className="text-lg font-bold text-emerald-900">3 Servers Active</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Agent Load</p>
                      <p className="text-lg font-bold text-amber-900">Optimal (12%)</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-slate-600 shadow-sm">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Deadline</p>
                      <p className="text-lg font-bold text-slate-900">18h 42m</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
                  <h2 className="text-3xl font-bold mb-8">System Architecture</h2>
                  
                  <div className="relative h-[500px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                    {/* Visual Diagram Representation */}
                    <div className="grid grid-cols-3 gap-20 relative z-10">
                      {/* Left: Sources */}
                      <div className="space-y-10">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 w-32">
                          <Calendar className="text-indigo-600" />
                          <span className="text-xs font-bold">G Calendar</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 w-32">
                          <CheckSquare className="text-indigo-600" />
                          <span className="text-xs font-bold">Todoist</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 w-32">
                          <BookOpen className="text-indigo-600" />
                          <span className="text-xs font-bold">Drive/Notes</span>
                        </div>
                      </div>

                      {/* Center: Agents */}
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="w-48 h-48 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin-slow absolute"></div>
                        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-2xl z-20 flex flex-col items-center gap-3">
                          <Cpu size={40} />
                          <span className="font-bold">ADK Orchestrator</span>
                        </div>
                        <div className="flex gap-4 mt-4">
                          <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold">ScheduleAgent</div>
                          <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold">TaskAgent</div>
                          <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold">KnowledgeAgent</div>
                        </div>
                      </div>

                      {/* Right: Storage */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 w-48">
                          <Database size={40} className="text-indigo-400" />
                          <div className="text-center">
                            <p className="font-bold">AlloyDB AI</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Vector + Relational</p>
                          </div>
                          <div className="w-full h-1 bg-indigo-500/30 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-indigo-400 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Lines (Simplified SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                      <path d="M 200 100 Q 400 250 600 250" stroke="indigo" strokeWidth="2" fill="none" />
                      <path d="M 200 250 Q 400 250 600 250" stroke="indigo" strokeWidth="2" fill="none" />
                      <path d="M 200 400 Q 400 250 600 250" stroke="indigo" strokeWidth="2" fill="none" />
                      <path d="M 600 250 L 800 250" stroke="indigo" strokeWidth="2" fill="none" />
                    </svg>
                  </div>

                  <div className="mt-12 grid grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">1. MCP Integration</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Using Model Context Protocol to securely bridge LLMs with real-world student data sources like Google Calendar and Todoist.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">2. ADK Orchestration</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Google Agent Development Kit handles complex multi-step reasoning and agent handoffs for high-fidelity task execution.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">3. AlloyDB AI</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Enterprise-grade Postgres with built-in vector search and Vertex AI integration for sub-millisecond semantic retrieval.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
