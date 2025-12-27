import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';


const LinkingToggle = ({ label, items, activeIds, onToggle, icon: Icon, color }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Icon className="w-3 h-3" /> {label}
        </label>
        <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
            {items.map(item => {
                const isSelected = activeIds?.includes(item.id);
                return (
                    <button key={item.id} type="button" onClick={() => onToggle(item.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-all ${isSelected ? 'bg-white shadow-sm border border-slate-200' : 'opacity-60 hover:opacity-100'}`}>
                        <span className={`font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{item.name}</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isSelected ? color : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isSelected ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                    </button>
                );
            })}
            {items.length === 0 && <p className="text-[10px] text-center py-2 text-slate-400 italic">No items available</p>}
        </div>
    </div>
);


const CreateAgent = (props) => {
    const [formData, setFormData] = useState({
        id: 0,
        name: '', description: '',
        linkedTools: [], linkedRag: [], linkedPrompts: [],
        status: 'active'
    });
    const [loading, setLoading] = useState(false);

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
            // await mockService.create('agents', formData);
            // await props.fetchData();
            props.onClose();
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={props.onClose} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-bold">Agent Configuration</h3>
                    <button onClick={props.onClose} className="text-slate-400"><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1">Agent Name</label>
                            <input required className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Customer Support AI" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1">Description</label>
                            <textarea rows={2} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                placeholder="Main purpose of this agent..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <LinkingToggle label="Link Tools" items={props.availableData?.tools || []} activeIds={formData.linkedTools} onToggle={id => toggleLink('linkedTools', id)} icon={Wrench} color="bg-indigo-600" />
                        <LinkingToggle label="Link Knowledge (RAG)" items={props.availableData?.rag || []} activeIds={formData.linkedRag} onToggle={id => toggleLink('linkedRag', id)} icon={Database} color="bg-emerald-600" />
                        <LinkingToggle label="Link Core Prompts" items={props.availableData?.prompts || []} activeIds={formData.linkedPrompts} onToggle={id => toggleLink('linkedPrompts', id)} icon={Terminal} color="bg-amber-600" />
                    </div>

                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                        <button type="button" onClick={props.onClose} className="flex-1 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-[2] py-2 bg-slate-900 text-white rounded-lg font-bold flex justify-center items-center gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} {formData.id ? 'Save Changes' : 'Deploy Agent'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default CreateAgent;