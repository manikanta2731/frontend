import { createToolApi, test_tool_api, updateToolById } from '@/service/tool_service';
import { Beaker, ChevronDown, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApiConfig, apiMethods, authTypes } from '../constants/constants';
import { Dropdown } from 'primereact/dropdown';

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '0.95rem',
    color: '#1e293b',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '10px',
    letterSpacing: '0.025em'
};

const jsonAreaStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    fontFamily: "'Fira Code', monospace",
    fontSize: '0.85rem',
    lineHeight: '1.6'
};

const dropdownStyles = `
    .custom-dropdown { 
        border: 1px solid #e2e8f0 !important; 
        border-radius: 12px !important;
        padding: 4px 8px !important;
        background: white !important;
        transition: all 0.2s ease;
    }
    .custom-dropdown:hover { border-color: #cbd5e1 !important; }
`;


const CreateTool = (props) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- TESTING STATES ---
    const [testInput, setTestInput] = useState('{\n  "q": "technology"\n}');
    const [testOutput, setTestOutput] = useState("");
    const [isTesting, setIsTesting] = useState(false);

    const [formData, setFormData] = useState({
        id : null,
        name: '',
        description: '',
        api_config: ApiConfig,
        creator_name: '',
        status: 'active'
    });

    const [paramString, setParamString] = useState(JSON.stringify(ApiConfig.parameters, null, 2));
    const [bodyString, setBodyString] = useState(JSON.stringify(ApiConfig.body, null, 2));

    useEffect(() => {
        if (props?.formData) {
            setIsCreateModalOpen(!!props.isCreateModalOpen);
            setIsEditModalOpen(!!props.isEditModalOpen);

            // 1. Handle the double-stringified api_config
            let parsedConfig = props.formData.api_config;

            if (typeof parsedConfig === 'string') {
                try {
                    parsedConfig = JSON.parse(parsedConfig);
                } catch (e) {
                    console.error("Failed to parse api_config string", e);
                    parsedConfig = ApiConfig; // Fallback to constant
                }
            }

            // 2. Set the form data with the actual object
            const updatedFormData = {
                ...props.formData,
                api_config: parsedConfig || ApiConfig
            };

            setFormData(updatedFormData);

            // 3. Update the JSON string editors
            setParamString(JSON.stringify(parsedConfig?.parameters || {}, null, 2));
            setBodyString(JSON.stringify(parsedConfig?.body || {}, null, 2));
        }
    }, [props.formData, props.isCreateModalOpen, props.isEditModalOpen]);

    const handleRunTest = async () => {
        setIsTesting(true);
        try {
            const parsedParams = JSON.parse(paramString || '{}');
            const parsedBody = JSON.parse(bodyString || '{}');
            const parsedArgs = JSON.parse(testInput || '{}');
            const authHeader = {};
            if (formData.api_config.auth?.type !== 'none' && formData.api_config.auth?.headerName) {
                authHeader[formData.api_config.auth.headerName] = formData.api_config.auth.value;
            }

            const testPayload = {
                api_config: {
                    ...formData.api_config,
                    headers: authHeader,
                    parameters: parsedParams,
                    body: parsedBody
                },
                arguments: parsedArgs
            };

            const res = await test_tool_api(testPayload);

            if (res.success) {
                setTestOutput(`[${res.status} OK] - ${res.time_ms}ms\n${JSON.stringify(res.response, null, 2)}`);
            } else {
                setTestOutput(`FAIL: ${res.error}`);
            }
        } catch (err) {
            setTestOutput(`JSON Error: Check your input formatting.`);
        } finally {
            setIsTesting(false);
        }
    };

    const setAuthHeaderType = (value) => {
        let authObj = { type: value, headerName: '', value: '' };
        if (value === 'apiKey') authObj.headerName = 'x-api-key';
        else if (value === 'bearer') authObj.headerName = 'Authorization';

        setFormData(prev => ({
            ...prev,
            api_config: { ...prev.api_config, auth: authObj }
        }));
    };

    // Generic handler for JSON changes to prevent crashes
    const handleJsonChange = (value, field) => {
        if (field === 'parameters') setParamString(value);
        else setBodyString(value);

        try {
            const parsed = JSON.parse(value);
            setFormData(prev => ({
                ...prev,
                api_config: { ...prev.api_config, [field]: parsed }
            }));
        } catch (e) {
            // Invalid JSON - do not update formData yet
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalPayload = {
                ...formData,
                api_config: {
                    ...formData.api_config,
                    parameters: JSON.parse(paramString),
                    body: JSON.parse(bodyString)
                }
            };
            const res = formData && formData.id ? await updateToolById(formData.id, finalPayload) : await createToolApi(finalPayload);
            if (res) {
                    setFormData({
                        id: null,
                        name: '',
                        description: '',
                        api_config: ApiConfig,
                        creator_name: '',
                        status: 'active'
                    });
                props?.fetchTools?.();
                closeModal();
            }
        } catch (err) {
            alert("Check JSON formatting before saving.");
        }
    };

    const closeModal = () => {
        props?.setIsCreateModalOpen(false);
        props?.setIsEditModalOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <style>{dropdownStyles}</style>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeModal} />

            <div className="relative z-10 w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">

                {/* Header */}
                <div className="px-10 py-6 border-b bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Beaker size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {isCreateModalOpen ? 'Create New Tool' : 'Edit Tool Configuration'}
                        </h3>
                    </div>
                    <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100 text-slate-400"><X /></button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT SIDE: FORM (Scrollable) */}
                    <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto px-10 py-8 space-y-10 bg-[#f8fafc] border-r border-slate-200">

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">General</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label style={labelStyle}>Tool Name</label>
                                    <input required style={inputStyle} value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Creator</label>
                                    <input required style={inputStyle} value={formData.creator_name || ''} onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label style={labelStyle}>Description</label>
                                <textarea required style={inputStyle} rows={2} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label style={labelStyle}>URL</label>
                                    <input required style={inputStyle} value={formData.api_config?.url || ''} onChange={(e) => setFormData({ ...formData, api_config: { ...formData.api_config, url: e.target.value } })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>API Type</label>
                                    <input required style={inputStyle} value={formData.api_config?.type || ''} onChange={(e) => setFormData({ ...formData, api_config: { ...formData.api_config, type: e.target.value } })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div>
                                    <label style={labelStyle}>Method</label>
                                    <Dropdown value={formData.api_config?.method} options={apiMethods} onChange={(e) => setFormData({ ...formData, api_config: { ...formData.api_config, method: e.value } })} className="w-full custom-dropdown" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Auth Type</label>
                                    <Dropdown value={formData.api_config?.auth?.type} options={authTypes} onChange={(e) => setAuthHeaderType(e.value)} className="w-full custom-dropdown" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Auth Token</label>
                                    <input style={inputStyle} value={formData.api_config?.auth?.value || ''} onChange={(e) => setFormData({ ...formData, api_config: { ...formData.api_config, auth: { ...formData.api_config.auth, value: e.target.value } } })} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Data Schema</h4>
                            <div className="space-y-6">
                                <div>
                                    <label style={labelStyle}>URL Parameters (JSON Schema)</label>
                                    <textarea rows={6} style={jsonAreaStyle} value={paramString} onChange={(e) => handleJsonChange(e.target.value, 'parameters')} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Request Body (JSON Schema)</label>
                                    <textarea rows={6} style={jsonAreaStyle} value={bodyString} onChange={(e) => handleJsonChange(e.target.value, 'body')} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <label style={labelStyle}>Deployment Status</label>
                            <div className="relative">
                                <select style={inputStyle} className="appearance-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="active">🟢 Active</option>
                                    <option value="maintenance">🟠 Maintenance</option>
                                    <option value="deprecated">🔴 Deprecated</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </section>
                    </form>

                    {/* RIGHT SIDE: TESTING PANEL (Fixed) */}
                    <div className="w-[400px] bg-slate-50 flex flex-col border-l border-slate-200">
                        <div className="p-6 border-b bg-slate-100/50">
                            <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                <Play size={16} className="text-emerald-600" />
                                Live Test Bench
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">Test your config with real values</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <label style={labelStyle}>Test Input (Arguments)</label>
                                <textarea
                                    style={{ ...jsonAreaStyle, backgroundColor: '#ffffff', color: '#1e293b', height: '150px' }}
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleRunTest}
                                disabled={isTesting}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {isTesting ? "Executing..." : "Run Test Call"}
                            </button>

                            <div>
                                <label style={labelStyle}>Output Response</label>
                                <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-auto max-h-[300px] border border-slate-800">
                                    <pre>{testOutput || "// Run a test to see results"}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-6 border-t bg-white flex justify-end gap-4">
                    <button type="button" onClick={closeModal} className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">Cancel</button>
                    <button onClick={handleCreateSubmit} className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                        {isCreateModalOpen ? 'Create Tool' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTool;