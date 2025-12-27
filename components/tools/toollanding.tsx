import React, { useState, useEffect } from 'react';
import {
    Plus,
    Settings2,
    Wrench,
    Search,
    Edit3,
    Eye,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { getAllTools } from '@/service/backend_service';
import CreateTool from './createtool';

const ToolLanding = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState(null);
    const [formData, setFormData] = useState({name: '', description: '', api_config: '' , creator_name: '' , status :'active'});

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const res = await getAllTools();
            if (res && res?.length > 0) {
                setTools(res)
            }
        } catch (error) {
            console.error("Failed to fetch tools", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (tool) => {
        setSelectedTool(tool);
        setFormData({ name: tool.name, description: tool.description, status: tool.status , api_config: tool.api_config , creator_name : tool.creator_name});
        setIsEditModalOpen(true);
    };

    const filteredTools = tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Wrench className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">MCP Tool Hub</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-full text-sm transition-all w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-indigo-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Tool</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">My Tools</h2>
                    <p className="text-slate-500 mt-1">Manage and deploy your Model Context Protocol capabilities.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 animate-pulse">Synchronizing tools with backend...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool) => (
                            <div
                                key={tool.id}
                                className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg ${tool.status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                        <Settings2 className="w-6 h-6" />
                                    </div>
                                    <button
                                        onClick={() => handleOpenEdit(tool)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-slate-500 text-sm mt-2 line-clamp-2 h-10">
                                    {tool.description}
                                </p>

                                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {tool.status === 'active' ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                        )}
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            {tool.status}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                        v{tool.version}
                                    </span>
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
                    setFormData={setFormData}
                    fetchTools={fetchTools}
                />
            )}
        </div>
    );
};

export default ToolLanding;
