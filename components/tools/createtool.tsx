import { createToolApi } from '@/service/tool_service';
import {
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';


const CreateTool = (props) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState( false);
    const [formData, setFormData] = useState({ name: '', description: '', api_config: '' , creator_name: '' , status :'active'});

    useEffect(() => {
        if(props){
            setIsCreateModalOpen(props && props?.isCreateModalOpen ? props.isCreateModalOpen : false);
            setIsEditModalOpen(props && props?.isEditModalOpen ? props.isEditModalOpen : false);
            setFormData(props?.formData);
       }
    },[props])

    const handleCreateSubmit = async(e) => {
        try{
            e.preventDefault();
            let payload = formData
            const res = await createToolApi(payload);
            if (res) {
                console.log("tool response " , res);
                setFormData({ name: '', description: '', api_config: '' , creator_name: '' , status :'active'});
                props?.setFormdata({  name: '', description: '', api_config: '' , creator_name: '' , status :'active' });
                await props?.fetchTools();
            }
            props?.setIsCreateModalOpen(false); 
            props?.setIsEditModalOpen(false);
        }catch (e) {
            console.log(e)
            props?.setIsCreateModalOpen(false); 
            props?.setIsEditModalOpen(false);
        }   
    };
    
    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { props?.setIsCreateModalOpen(false); props?.setIsEditModalOpen(false);}} />

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">
                                {isCreateModalOpen ? 'Create New Tool' : 'Edit Tool Configuration'}
                            </h3>
                            <button onClick={() => { props?.setIsCreateModalOpen(false); props?.setIsEditModalOpen(false); }} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Tool Name</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Weather API"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="What does this tool enable the LLM to do?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Api Configuration</label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="What does this tool enable the LLM to do?"
                                    value={formData.api_config}
                                    onChange={(e) => setFormData({ ...formData, api_config: e.target.value })}
                                />
                            </div>

                             <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Creator Name</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Weather API"
                                    value={formData.creator_name}
                                    onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Deployment Status</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="deprecated">Deprecated</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { props?.setIsCreateModalOpen(false); props?.setIsEditModalOpen(false); }}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                >
                                    {isCreateModalOpen ? 'Create Tool' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
    )

}

export default CreateTool;