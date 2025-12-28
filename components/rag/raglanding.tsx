import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';
import CreateRag from './createrag';
import { IconButton } from '@mui/material';
import { Toast } from "primereact/toast";
import { useRef } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteRagById, getAllRags } from '@/service/tool_service';


const RagLanding = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const toast = useRef<Toast>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res =  await getAllRags();
            setItems(res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const deleteRag = async (rag) => {
        try {
            await deleteRagById(rag.id);
            setItems(items.filter(i => i.id !== rag.id));
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: `RAG "${rag.name}" deleted successfully.`, life: 3000 });
        } catch (e) {
            console.error(e);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to delete RAG "${rag.name}".`, life: 3000 });
        }
    };

    const handleOpenCreate = () => {
        setSelectedItem({ name: '', description: '', status: 'active', creator_name: 'Admin', files: []});
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Toast ref={toast} position="top-right" />
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">RAG Knowledge</h2>
                    <p className="text-slate-500">Manage your vector database sources.</p>
                </div>
                <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-md">
                    <Plus className="w-4 h-4" /> Create RAG
                </button>
            </header>

            {loading ? (
                <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                            <div className="flex justify-between mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Database /></div>
                                <div>
                                    <IconButton style={{color: 'black'}} onClick={() => { handleOpenEdit(item)  }}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton style={{color: 'red'}} onClick={() => { deleteRag(item); }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                 </div>
                            </div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
            <CreateRag isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={selectedItem} fetchData={fetchItems} />
        </div>
    );
};


export default RagLanding;