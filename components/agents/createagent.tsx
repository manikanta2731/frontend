import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity,
    ArrowUpRight,
    Cpu
} from 'lucide-react';
import { createAgentApi, updateAgentById } from '@/service/tool_service';
import {
    MenuItem,
    TextField
} from '@mui/material';
import { Toast } from 'primereact/toast';


const LinkingToggle = ({ label, items, activeIds, onToggle, icon: Icon, colorClass }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Icon className="w-3 h-3" /> {label}
        </label>
        <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100 min-h-[60px]">
            {items.map(item => {
                const isSelected = activeIds?.includes(item.id);
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggle(item.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm
                        ${isSelected ? `${colorClass} text-white border-transparent scale-105` : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 opacity-60'}`}
                    >
                        {item.name}
                        {isSelected && <ArrowUpRight size={12} />}
                    </button>
                );
            })}
            {items.length === 0 && <p className="text-[10px] text-slate-400 italic m-auto">No resources available</p>}
        </div>
    </div>
);


const CreateAgent = (props) => {
    const [formData, setFormData] = useState({
        id: 0,
        name: '', description: '', system_prompt: '', llm_provider: '',
        tool_ids: [], rag_ids: [], prompt_ids: [], creator_name: 'Admin',
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (props.formData) setFormData(props.formData);
    }, [props.formData]);

    const toggleLink = (key, id) => {
        const current = formData[key] || [];
        const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
        setFormData({ ...formData, [key]: next });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            formData?.id ? await updateAgentById(formData.id, formData) : await createAgentApi(formData);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Agent ' + (formData?.id ? 'updated' : 'created') + ' successfully.', life: 3000 });
            await props.fetchData();
            props.onClose();
        } catch (e) {
            console.error(e);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save agent.', life: 3000 });
        }
        finally { setLoading(false); }
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={props.onClose} />
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[92vh] overflow-hidden border border-slate-100 animate-in zoom-in duration-300">

                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-slate-50 to-transparent">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Agent Architect</h3>
                        <p className="text-sm text-slate-500 font-medium">Link capabilities to create a specialized workforce.</p>
                    </div>
                    <button onClick={props.onClose} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-10">
                        {/* Basic Config */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Agent Name</label>
                                <input required className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                                    placeholder="Marketing Analyst AI" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deployment Instruction</label>
                                <textarea rows={8} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                                    placeholder="Define how the agent should behave..." value={formData.system_prompt} onChange={e => setFormData({ ...formData, system_prompt: e.target.value })} />
                            </div>
                        </div>

                        {/* Resource Linking */}
                        <div className="space-y-8 bg-slate-50/30 p-6 rounded-[32px] border border-slate-100">
                            <LinkingToggle label="Equip Tools" items={props.availableData?.tools || []} activeIds={formData.tool_ids} onToggle={id => toggleLink('tool_ids', id)} icon={Wrench} colorClass="bg-indigo-600" />
                            <LinkingToggle label="Attach Knowledge" items={props.availableData?.rag || []} activeIds={formData.rag_ids} onToggle={id => toggleLink('rag_ids', id)} icon={Database} colorClass="bg-emerald-600" />
                            <LinkingToggle label="Inject Personas" items={props.availableData?.prompts || []} activeIds={formData.prompt_ids} onToggle={id => toggleLink('prompt_ids', id)} icon={Terminal} colorClass="bg-amber-600" />

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">LLM Engine</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700"
                                        value={formData.llm_provider}
                                        onChange={e => setFormData({ ...formData, llm_provider: e.target.value })}
                                    >
                                        <option value="">Select a brain...</option>
                                        {props?.availableData?.llms?.map((llm) => (
                                            <option key={llm.id} value={llm.model}>{llm.provider} - {llm.model}</option>
                                        ))}
                                    </select>
                                    <Activity size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={props.onClose} className="px-8 py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all">Discard</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 px-8 bg-slate-900 text-white rounded-2xl font-black flex justify-center items-center gap-3 shadow-2xl shadow-slate-300 hover:bg-black hover:-translate-y-1 transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : <Cpu size={20} />}
                            {formData.id ? 'Update Capabilities' : 'Initialize Agent'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAgent;