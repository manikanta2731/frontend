import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity,
    UserCircle,
    Sparkles
} from 'lucide-react';
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { createPromptApi, updatePromptById } from '@/service/tool_service';

const CreatePrompt = (props) => {
    const [formData, setFormData] = useState({ id: 0, name: '', template: '', creator_name: 'Admin', status: 'active' });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        if (props.formData) setFormData(props.formData);
    }, [props.formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            formData.id ? await updatePromptById(formData.id, formData) : await createPromptApi(formData);
            await props.fetchData();
            props.onClose();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={props.onClose} />
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-transparent">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Persona Configuration</h3>
                        <p className="text-sm text-slate-500">Define the system logic and tone.</p>
                    </div>
                    <button onClick={props.onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prompt Identity</label>
                            <input required className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                placeholder="e.g. Creative Writer"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Creator</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                <input required className="w-full pl-12 pr-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                    value={formData.creator_name} onChange={e => setFormData({ ...formData, creator_name: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">System Instructions</label>
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 focus-within:border-amber-500 transition-all shadow-inner">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                            <textarea required rows={10} 
                                className="w-full px-6 py-4 bg-slate-50/50 outline-none font-mono text-sm leading-relaxed text-slate-700"
                                placeholder="Paste your system prompt here..." 
                                value={formData.template} onChange={e => setFormData({ ...formData, template: e.target.value })} 
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                            <Sparkles size={10}/> Tip: Use clear, concise constraints for best LLM performance.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={props.onClose} className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Discard
                        </button>
                        <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-amber-600 text-white rounded-2xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-amber-200 hover:bg-amber-700 hover:-translate-y-1 transition-all">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles size={20}/>}
                            Save Persona
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreatePrompt;