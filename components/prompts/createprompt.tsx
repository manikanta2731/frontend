import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { createPromptApi, updatePromptById } from '@/service/tool_service';


const CreatePrompt = (props) => {
    const [formData, setFormData] = useState({ id: 0, name: '', template: '', creator_name : 'Admin', status: 'active' });
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (props.formData) setFormData(props.formData);
    }, [props.formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            formData.id ? await updatePromptById(formData.id, formData) : await createPromptApi(formData);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Prompt "${formData.name}" saved successfully.`, life: 3000 });
            await props.fetchData();
            props.onClose();
        } catch (e) {
            console.error(e);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to save prompt "${formData.name}".`, life: 3000 });
        } finally { setLoading(false); }
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Toast ref={toast} position="top-right" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={props.onClose} />
            <div style={{ color: 'black' }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Configure System Prompt</h3>
                    <button onClick={props.onClose} className="text-slate-400"><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Prompt Name</label>
                        <input required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">System Instructions</label>
                        <textarea required rows={8} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm"
                            placeholder="You are a helpful assistant..." value={formData.template} onChange={e => setFormData({ ...formData, template: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Creator Name</label>
                        <input required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none"
                            value={formData.creator_name} onChange={e => setFormData({ ...formData, creator_name: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={props.onClose} className="flex-1 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-medium flex justify-center items-center gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Prompt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePrompt;