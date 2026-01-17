import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Wrench, Search, Edit3, Loader2, Database, 
    Terminal, UserSquare2, Trash2, Cpu, ArrowUpRight, Activity
} from 'lucide-react';
import { deleteAgentById, getAllAgents, getAllLLMProviders, getAllPrompts, getAllRags, getAllTools } from '@/service/tool_service';
import { Toast } from "primereact/toast";
import CreateAgent from './createagent';

const AgentLanding = () => {
    const [agents, setAgents] = useState([]);
    const [availableData, setAvailableData] = useState({ tools: [], rag: [], prompts: [], llms: [] });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const toast = useRef(null);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [a, t, r, p, l] = await Promise.all([
                getAllAgents(), getAllTools(), getAllRags(), getAllPrompts(), getAllLLMProviders()
            ]);
            setAgents(a || []);
            setAvailableData({ tools: t || [], rag: r || [], prompts: p || [], llms: l || [] });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const deleteAgent = async (agent) => {
        if (window.confirm(`Decommission Agent "${agent.name}"?`)) {
            try {
                await deleteAgentById(agent.id);
                setAgents(agents.filter(a => a.id !== agent.id));
                toast.current?.show({ severity: 'success', summary: 'Decommissioned', detail: `Agent removed.`, life: 3000 });
            } catch (e) { console.error(e); }
        }
    };

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]" style={{ backgroundImage: 'radial-gradient(at 0% 0%, #f1f5f9 0, transparent 50%), radial-gradient(at 100% 0%, #e2e8f0 0, transparent 50%)' }}>
            <Toast ref={toast} />
            
            <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg shadow-slate-200">
                        <Cpu className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-800">AGENT <span className="font-light text-slate-400">CORE</span></h1>
                </div>

                <button onClick={() => { setSelectedAgent({ name: '', description: '', tool_ids: [], rag_ids: [], prompt_ids: [] }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black hover:scale-105 active:scale-95 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200">
                    <Plus className="w-5 h-5" />
                    <span>Deploy Agent</span>
                </button>
            </nav>

            <main className="max-w-7xl mx-auto p-10">
                <header className="mb-12">
                    <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">Intelligence Hub</h2>
                    <p className="text-slate-500 mt-3 text-lg font-medium">Orchestrate your AI workforce by combining logic, tools, and data.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32"><Loader2 className="animate-spin text-slate-900 w-12 h-12" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {agents.map(item => (
                            <div key={item.id} style={glassStyle} className="group rounded-[32px] p-8 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border-2 border-transparent hover:border-indigo-500/20">
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <button onClick={() => { setSelectedAgent(item); setIsModalOpen(true); }} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Edit3 size={18}/></button>
                                    <button onClick={() => deleteAgent(item)} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18}/></button>
                                </div>

                                <div className="flex gap-6 items-start mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-slate-800 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                        <UserSquare2 size={40} />
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Activity size={12} className="text-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2 italic">"{item.description}"</p>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col items-center">
                                        <Wrench className="w-4 h-4 text-indigo-500 mb-1" />
                                        <span className="text-lg font-black text-slate-700">{item.tool_ids?.length || 0}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Tools</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col items-center">
                                        <Database className="w-4 h-4 text-emerald-500 mb-1" />
                                        <span className="text-lg font-black text-slate-700">{item.rag_ids?.length || 0}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Knowledge</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col items-center">
                                        <Terminal className="w-4 h-4 text-amber-500 mb-1" />
                                        <span className="text-lg font-black text-slate-700">{item.prompt_ids?.length || 0}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Prompts</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <CreateAgent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={selectedAgent} availableData={availableData} fetchData={fetchAll} />
        </div>
    );
};

export default AgentLanding;