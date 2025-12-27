import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';
import CreateAgent from './createagent';


const AgentLanding = () => {
    const [agents, setAgents] = useState([]);
    const [availableData, setAvailableData] = useState({ tools: [], rag: [], prompts: [] });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    useEffect(() => { 
        fetchAll(); 
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            // const [a, t, r, p] = await Promise.all([
            //     mockService.getAll('agents'),
            //     mockService.getAll('tools'),
            //     mockService.getAll('rag'),
            //     mockService.getAll('prompts')
            // ]);
            // setAgents(a || []);
            // setAvailableData({ tools: t || [], rag: r || [], prompts: p || [] });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Agent Hub</h2>
                    <p className="text-slate-500">Coordinate tools, knowledge, and personas.</p>
                </div>
                <button onClick={() => { setSelectedAgent({ name: '', description: '', linkedTools: [], linkedRag: [], linkedPrompts: [] }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-200">
                    <Plus className="w-4 h-4" /> Deploy Agent
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-900 w-10 h-10" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {agents.map(item => (
                        <div key={item.id} className="bg-white border-2 border-slate-50 rounded-2xl p-6 hover:border-indigo-100 transition-all">
                            <div className="flex justify-between mb-4">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><UserSquare2 size={32} /></div>
                                <button onClick={() => { setSelectedAgent(item); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-indigo-600"><Edit3 /></button>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                            <div className="mt-4 flex gap-3 text-[10px] font-black uppercase text-slate-400">
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Wrench className="w-3 h-3" /> {item.linkedTools?.length || 0} Tools
                                </span>
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Database className="w-3 h-3" /> {item.linkedRag?.length || 0} Knowledge
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <CreateAgent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={selectedAgent} availableData={availableData} fetchData={fetchAll} />
        </div>
    );
};


export default AgentLanding;