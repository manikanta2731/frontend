import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Search, Terminal, Loader2, Trash2, Edit3, 
    Sparkles, UserCircle, MessageSquareQuote
} from 'lucide-react';
import CreatePrompt from './createprompt';
import { deletePromptById, getAllPrompts } from '@/service/tool_service';
import { Toast } from "primereact/toast";

const PromptLanding = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const toast = useRef(null);

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
        if (window.confirm(`Delete "${prompt.name}"?`)) {
            try {
                await deletePromptById(prompt.id);
                setItems(items.filter(i => i.id !== prompt.id));
                toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Prompt removed', life: 3000 });
            } catch (e) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete', life: 3000 });
            }
        }
    };

    const filtered = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
    };

    return (
        <div className="min-h-screen bg-[#fffcf9]" style={{ backgroundImage: 'radial-gradient(at 100% 100%, #fff7ed 0, transparent 50%), radial-gradient(at 0% 0%, #fffbeb 0, transparent 50%)' }}>
            <Toast ref={toast} />
            
            {/* Nav */}
            <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-orange-100 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500 p-2.5 rounded-xl shadow-lg shadow-amber-200">
                        <Terminal className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-800">PROMPT <span className="font-light text-slate-400">LAB</span></h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search personas..."
                            className="pl-12 pr-6 py-2.5 bg-white border border-orange-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 rounded-2xl text-sm transition-all w-80 outline-none shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setSelectedItem({ name: '', template: '' , creator_name: 'Admin'}); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 hover:scale-105 active:scale-95 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-amber-200"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Prompt</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-10">
                <header className="mb-12">
                    <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">System Personas</h2>
                    <p className="text-slate-500 mt-3 text-lg font-medium">Craft the identity and behavior logic for your AI agents.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(item => (
                            <div key={item.id} style={glassStyle} className="group rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-6 flex gap-2">
                                    <button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="p-2 bg-white/50 hover:bg-white text-slate-400 hover:text-amber-600 rounded-xl transition-all border border-orange-50"><Edit3 size={16}/></button>
                                    <button onClick={() => deletePrompt(item)} className="p-2 bg-white/50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-orange-50"><Trash2 size={16}/></button>
                                </div>

                                <div>
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><Sparkles size={24}/></div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.name}</h3>
                                    <div className="relative">
                                        <MessageSquareQuote className="absolute -left-1 -top-2 w-4 h-4 text-amber-200" />
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-4 pl-4 italic">
                                            {item.template}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-orange-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                            {item.creator_name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400">{item.creator_name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-wider">Active</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <CreatePrompt isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={selectedItem} fetchData={fetchItems} />
        </div>
    );
};

export default PromptLanding;