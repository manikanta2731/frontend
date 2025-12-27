import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, Search, Edit3, CheckCircle2, AlertCircle,
    Loader2, Database, Terminal, UserSquare2, X, FileUp, Activity
} from 'lucide-react';
import CreatePrompt from './createprompt';

const PromptLanding = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            // const res = await mockService.getAll('prompts');
            // setItems(res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Prompt Library</h2>
                    <p className="text-slate-500">Define your system personas and templates.</p>
                </div>
                <button onClick={() => { setSelectedItem({ name: '', template: '' }); setIsModalOpen(true); }} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">
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
                                <button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-amber-600"><Edit3 className="w-5 h-5" /></button>
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