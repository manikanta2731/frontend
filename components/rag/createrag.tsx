import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { createRagApi, updateRagById } from '@/service/tool_service';

const CreateRag = (props) => {
    const [formData, setFormData] = useState({ id: 0, name: '', description: '', creator_name: 'Admin', status: 'active', files: [] });
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [addedFiles, setAddedFiles] = useState<Array<File>>([]);

    useEffect(() => {
        if (props.formData) {
            setFormData(props.formData);
        }
    }, [props.formData]);

    const filesToBase64 = async (files: File[]): Promise<any[]> => {
        const promises = Array.from(files).map(file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const result = reader.result;
                if (typeof result === "string") {
                    const base64Data = result.split(',')[1];
                    resolve({
                        file_name: file.name,
                        file_data: base64Data,
                        mime_type: file.type || "application/octet-stream"
                    });
                } else {
                    reject(new Error("FileReader result is not a string"));
                }
            };

            reader.onerror = error => reject(error);
        }));

        return Promise.all(promises);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const filesPayload = await filesToBase64(addedFiles);
            const payload = { ...formData, files: filesPayload };
            formData.id ? await updateRagById(formData.id, payload) : await createRagApi(payload);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `RAG "${formData.name}" saved successfully.`, life: 3000 });
            await props.fetchData();
            props.onClose();
        } catch (error) {
            console.log("Failed to save RAG", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to save RAG "${formData.name}".`, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Toast ref={toast} position="top-right" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={props.onClose} />
            <div style={{ color: 'black' }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
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
                            <input
                                type="file"
                                multiple
                                onChange={e => setAddedFiles(Array.from(e.target.files))}
                            />
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
