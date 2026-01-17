import React, { useEffect, useState } from "react";
import {
  Plus, Database, FileText, UploadCloud, Loader2,
  Search, HardDrive, Trash2, ChevronRight, Info
} from "lucide-react";
import { getAllRags, getRagFilesByRagId, createRagApi, updateRagById } from "@/service/tool_service";

const RagPage = () => {
  const [rags, setRags] = useState([]);
  const [selectedRag, setSelectedRag] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchRags(); }, []);

  const fetchRags = async () => {
    const res = await getAllRags();
    setRags(res || []);
    if (res?.length && !selectedRag) selectRag(res[0]);
  };

  const selectRag = async (rag) => {
    setSelectedRag(rag);
    setFiles([]);
    setLoadingFiles(true);
    const res = await getRagFilesByRagId(rag.id);
    setFiles(res || []);
    setLoadingFiles(false);
  };

  const filteredRags = rags.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-[calc(100vh-20px)] flex m-2 rounded-[32px] overflow-hidden bg-white border border-slate-200 shadow-2xl">

      {/* ================= LEFT: KNOWLEDGE NAVIGATOR ================= */}
      <aside className="w-[380px] bg-slate-50/50 border-r border-slate-100 flex flex-col">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Knowledge</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Base Index</p>
            </div>
            <button
              onClick={() => setSelectedRag({ id: 0, name: "", description: "", creator_name: "Admin" })}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-100 transition-all hover:scale-110 active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search sources..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-emerald-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
          {filteredRags.map(rag => (
            <div
              key={rag.id}
              onClick={() => selectRag(rag)}
              className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between
                ${selectedRag?.id === rag.id
                  ? "bg-white shadow-xl shadow-emerald-100/50 border border-emerald-100 ring-1 ring-emerald-50"
                  : "hover:bg-white/60 border border-transparent"}`}
            >
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-xl transition-colors ${selectedRag?.id === rag.id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 group-hover:text-emerald-600 border border-slate-100'}`}>
                  <Database size={20} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${selectedRag?.id === rag.id ? 'text-slate-900' : 'text-slate-600'}`}>{rag.name || "Untitled Source"}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase font-bold tracking-tighter">
                    {rag.id ? `ID: ${rag.id}` : "New Entry"}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className={`${selectedRag?.id === rag.id ? 'text-emerald-500' : 'text-slate-300 opacity-0 group-hover:opacity-100'} transition-all`} />
            </div>
          ))}
        </div>
      </aside>

      {/* ================= RIGHT: SOURCE STUDIO ================= */}
      <main className="flex-1 bg-white flex flex-col relative overflow-hidden">
        {!selectedRag ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
            <div className="p-6 bg-slate-50 rounded-full animate-pulse"><HardDrive size={48} /></div>
            <p className="font-bold tracking-widest text-xs uppercase">Select a knowledge source to edit</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-12">
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Inputs */}
                <div className="space-y-4">
                  <input
                    value={selectedRag.name}
                    onChange={e => setSelectedRag({ ...selectedRag, name: e.target.value })}
                    placeholder="Knowledge Source Name"
                    className="text-4xl font-black w-full focus:outline-none placeholder:text-slate-200 text-slate-800 tracking-tight"
                  />
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Info size={12} /> Info
                    </div>
                    <span className="text-xs text-slate-400">Created by <span className="text-emerald-600 font-bold">{selectedRag.creator_name}</span></span>
                  </div>
                  <textarea
                    value={selectedRag.description}
                    onChange={e => setSelectedRag({ ...selectedRag, description: e.target.value })}
                    placeholder="Describe the context of these documents..."
                    className="mt-6 w-full text-lg text-slate-500 bg-transparent border-l-2 border-slate-100 pl-6 focus:border-emerald-500 outline-none transition-all resize-none min-h-[80px]"
                  />
                </div>

                {/* Files Section */}
                <section className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Indexed Documents</h4>
                    <label className="flex gap-2 items-center cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600 hover:shadow-md transition-all">
                      <UploadCloud size={16} />
                      Upload Files
                      <input type="file" multiple hidden onChange={e => setNewFiles(Array.from(e.target.files || []))} />
                    </label>
                  </div>

                  {loadingFiles ? (
                    <div className="flex py-10 justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {files.map(f => (
                        <div key={f.id} className="group flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/20 transition-all">
                          <div className="flex gap-3 items-center">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileText size={18} /></div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-700 truncate w-32">{f.file_name}</p>
                              <p className="text-[10px] text-slate-400">{(f.file_size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      {newFiles.map((nf, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-emerald-50/50 border border-dashed border-emerald-200 rounded-2xl">
                          <div className="flex gap-3 items-center">
                            <FileText size={18} className="text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-700">{nf.name}</span>
                          </div>
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black">NEW</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-8 border-t border-slate-50 bg-white/80 backdrop-blur-md flex justify-end">
              <button
                onClick={() => {/* Save function here */ }}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 hover:scale-105 active:scale-95 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <HardDrive size={20} />}
                {saving ? "Indexing Data..." : "Synchronize Source"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RagPage;