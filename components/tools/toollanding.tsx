import React, { useState, useEffect } from 'react';
import {
    Plus,
    Settings2,
    Wrench,
    Search,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { getAllTools, deleteToolById } from '@/service/tool_service';
import CreateTool from './createtool';

const ToolLanding = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', description: '', api_config: '', creator_name: '', status: 'active' });

    useEffect(() => { fetchTools(); }, []);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const res = await getAllTools();
            if (res) setTools(res);
        } catch (error) {
            console.error("Failed to fetch tools", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tool? This action cannot be undone.")) {
            try {
                await deleteToolById(id);
                fetchTools();
            } catch (error) {
                alert("Failed to delete tool");
            }
        }
    };

    const handleOpenEdit = (tool) => {
        setFormData({
            name: tool.name,
            description: tool.description,
            status: tool.status,
            api_config: tool.api_config,
            creator_name: tool.creator_name,
            id: tool.id // necessary for edit
        });
        setIsEditModalOpen(true);
    };

    const filteredTools = tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Inline Styled Objects for the "Stunning" look
    const glassCardStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    };

    const gradientHeader = {
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] text-slate-900" style={{ backgroundImage: 'radial-gradient(at 0% 0%, #e0e7ff 0, transparent 50%), radial-gradient(at 50% 0%, #f5f3ff 0, transparent 50%)' }}>

            {/* Nav */}
            <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                        <Wrench className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-800">MCP <span className="font-light text-slate-400">HUB</span></h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a capability..."
                            className="pl-12 pr-6 py-2.5 bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl text-sm transition-all w-80 outline-none shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ id: null, name: '', description: '', api_config: '', creator_name: '', status: 'active' });
                            setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Tool</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-10">
                <header className="mb-12">
                    <h2 className="text-5xl font-extrabold tracking-tight" style={gradientHeader}>Tool Library</h2>
                    <p className="text-slate-500 mt-3 text-lg font-medium">Power up your AI agents with custom HTTP capabilities.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium tracking-wide">Fetching your toolset...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTools.map((tool) => (
                            <div
                                key={tool.id}
                                style={glassCardStyle}
                                className="group rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 relative flex flex-col justify-between"
                            >
                                {/* Floating Badges */}
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <button
                                        onClick={() => handleOpenEdit(tool)}
                                        className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:shadow-md rounded-xl transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tool.id)}
                                        className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:shadow-md rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${tool.status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Settings2 className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {tool.description || "No description provided for this tool."}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            {tool.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs cursor-pointer hover:underline">
                                        View Details <ExternalLink size={12} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {(isCreateModalOpen || isEditModalOpen) && (
                <CreateTool
                    isCreateModalOpen={isCreateModalOpen}
                    isEditModalOpen={isEditModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                    formData={formData}
                    setFormdata={setFormData}
                    fetchTools={fetchTools}
                />
            )}
        </div>
    );
};

export default ToolLanding;