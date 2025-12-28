import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';
import CreatePrompt from './createprompt';
import { deletePromptById, getAllPrompts } from '@/service/tool_service';
import { IconButton } from '@mui/material';
import { Toast } from "primereact/toast";
import { useRef } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const PromptLanding = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const toast = useRef<Toast>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await getAllPrompts();
            setItems(res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const deletePrompt = async (prompt) => {
            try {
                await deletePromptById(prompt.id);
                setItems(items.filter(i => i.id !== prompt.id));
                toast.current?.show({ severity: 'success', summary: 'Deleted', detail: `Prompt "${prompt.name}" deleted successfully.`, life: 3000 });
            } catch (e) {
                console.error(e);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to delete prompt "${prompt.name}".`, life: 3000 });
            }
        }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Toast ref={toast} position="top-right" />
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Prompt Library</h2>
                    <p className="text-slate-500">Define your system personas and templates.</p>
                </div>
                <button onClick={() => { setSelectedItem({ name: '', template: '' , creator_name: ''}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">
                    <Plus className="w-4 h-4" /> Create Prompt
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500 w-10 h-10" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
                            <div className="flex justify-between mb-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Terminal /></div>
                                <div>
                                    <IconButton style={{color: 'black'}} onClick={() => { setSelectedItem(item); setIsModalOpen(true);  }}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton style={{color: 'red'}} onClick={() => { deletePrompt(item); }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                 </div>
                            </div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-sm text-slate-500 mt-2 font-mono line-clamp-3 bg-slate-50 p-2 rounded">"{item.template}"</p>
                        </div>
                    ))}
                </div>
            )}
            <CreatePrompt isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={selectedItem} fetchData={fetchItems} />
        </div>
    );
};

export default PromptLanding;