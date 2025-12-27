import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';

const CreateRag = (props) => {
    const [formData, setFormData] = useState({id: 0, name: '', description: '', status: 'active' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.formData) {
            setFormData(props.formData);
        }
    }, [props.formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // // let res = await createRagApi(formData);
            // let res = await mockService.create('rag', formData);
            // if (res) {
            //     await props.fetchData();
            //     props.onClose();
            // }
        } catch (error) {
            console.error("Failed to save RAG", error);
        } finally {
            setLoading(false);
        }
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={props.onClose} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit RAG Source' : 'Create New RAG'}</h3>
                    <button onClick={props.onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Source Name</label>
                        <input required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g. Legal Documents" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea required rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                            placeholder="What knowledge does this contain?" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Data</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50 cursor-pointer transition-colors">
                            <FileUp className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-xs text-slate-500">Drag and drop files to index</p>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={props.onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} {formData.id ? 'Save Changes' : 'Create RAG'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRag;
