"use client";
import React, { useState } from "react";
import { 
  BookOpen, Cpu, Wrench, Database, 
  Terminal, Info, ChevronRight, 
  HelpCircle, Lightbulb, Code, 
  CheckCircle2, Box, Layers, ArrowRight
} from "lucide-react";

const RunbookPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Platform Overview", icon: Info, color: "text-slate-600" },
    { id: "agents", title: "Agents & Personas", icon: Cpu, color: "text-indigo-600" },
    { id: "tools", title: "Tools & Capabilities", icon: Wrench, color: "text-blue-600" },
    { id: "rag", title: "Knowledge Base (RAG)", icon: Database, color: "text-emerald-600" },
    { id: "prompts", title: "Prompt Engineering", icon: Terminal, color: "text-amber-600" },
  ];

  const FieldCard = ({ name, desc, example }) => (
    <div className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-50 transition-all cursor-default">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            ?
          </div>
          <p className="font-black text-xl text-slate-800 tracking-tight">{name}</p>
        </div>
        <p className="text-base text-slate-500 ml-10 leading-relaxed mb-4">{desc}</p>
        {example && (
          <div className="ml-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-indigo-600 overflow-x-auto whitespace-pre">
            {example}
          </div>
        )}
    </div>
);

  return (
    <div className="h-[calc(100vh-40px)] flex m-4 rounded-[40px] overflow-hidden bg-white border border-slate-200 shadow-2xl">
      
      {/* --- SIDE NAVIGATION --- */}
      <aside className="w-[320px] bg-slate-50/80 border-r border-slate-100 flex flex-col">
        <div className="p-10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <BookOpen size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Runbook</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Mastering the MCP Platform</p>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 ${
                  isActive 
                  ? "bg-white shadow-xl shadow-slate-200/50 text-indigo-600 border border-slate-100 translate-x-2" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={20} className={isActive ? sec.color : "text-slate-400"} />
                <span className="text-sm font-black tracking-tight">{sec.title}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </nav>

        <div className="p-8">
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] text-white">
                <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Quick Tip</p>
                <p className="text-xs leading-relaxed opacity-80">Descriptions for Tools are not just for humans—they are the instructions the AI uses to know when to act.</p>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto scroll-smooth bg-white custom-scrollbar">
        <div className="max-w-4xl mx-auto py-20 px-16 space-y-32">
          
          {/* Section: Overview */}
          <section id="overview" className="space-y-8 animate-in fade-in duration-700">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">The Architecture of Intelligence.</h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              Model Context Protocol (MCP) bridges the gap between raw AI power and your business data through four integrated layers.
            </p>
          </section>

          {/* Section: Agents */}
          <section id="agents" className="space-y-10">
            <header className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <Cpu size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">1. Agents (The Brain)</h2>
                  <p className="text-slate-500 font-medium">Defining the persona and decision-making logic.</p>
                </div>
            </header>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <FieldCard 
                      name="System Prompt" 
                      desc="The 'personality' code. It dictates how the agent processes information, its tone, and what it is forbidden from doing." 
                      example="Example: 'You are a Senior Security Auditor. Analyze all logs for suspicious IP patterns. Never disclose internal server paths.'"
                    />
                    <FieldCard 
                                  name="LLM Provider"
                                  desc="Selecting the compute engine. Use larger models (GPT-4) for complex logic and smaller models (Flash/Haiku) for speed." example={undefined}                    />
                    <FieldCard 
                                  name="Linked Resources"
                                  desc="The specific Tools and Knowledge sets this agent is authorized to access." example={undefined}                    />
                </div>
            </div>
          </section>

          {/* Section: Tools */}
          <section id="tools" className="space-y-10">
            <header className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                    <Wrench size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">2. Tools (The Hands)</h2>
                  <p className="text-slate-500 font-medium">Executable functions that allow AI to impact the real world.</p>
                </div>
            </header>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <FieldCard 
                      name="Tool Description" 
                      desc="The 'Manual' for the AI. If this is vague, the agent will never call the tool. Be specific about what data it returns." 
                      example="Poor: 'Searches data.' | Better: 'Fetches real-time stock prices for a given ticker symbol. Use this for market analysis queries.'"
                    />
                    <FieldCard 
                      name="JSON Schema (Input)" 
                      desc="The strict data structure the tool requires to run successfully." 
                      example='Example: { "type": "object", "properties": { "order_id": { "type": "string" } } }'
                    />
                </div>
            </div>
          </section>

          {/* Section: RAG */}
          <section id="rag" className="space-y-10">
            <header className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                    <Database size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">3. Knowledge Base (RAG)</h2>
                  <p className="text-slate-500 font-medium">Long-term memory for private documents and data.</p>
                </div>
            </header>
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                    <FieldCard 
                                  name="Chunking Strategy"
                                  desc="How your documents are split up. Smaller chunks allow for more precise retrieval of facts." example={undefined}                    />
                    <FieldCard 
                                  name="Vector Store"
                                  desc="The database where your text is converted into 'numbers' for the AI to search semantically." example={undefined}                    />
                </div>
                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                  <h5 className="font-black text-slate-800 mb-4 flex items-center gap-2 underline decoration-emerald-400 underline-offset-4">Typical RAG Workflow</h5>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <div className="text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">PDF Upload</div>
                    <ArrowRight size={16} />
                    <div className="text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">Text Extraction</div>
                    <ArrowRight size={16} />
                    <div className="text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">Embedding</div>
                    <ArrowRight size={16} />
                    <div className="text-center bg-emerald-600 text-white p-3 rounded-xl shadow-lg">Vector Search</div>
                  </div>
                </div>
            </div>
          </section>

          {/* Section: Prompts */}
          <section id="prompts" className="space-y-10">
            <header className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-amber-100">
                    <Terminal size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">4. Prompts (Templates)</h2>
                  <p className="text-slate-500 font-medium">Standardizing high-quality outputs across your team.</p>
                </div>
            </header>
            <div className="grid grid-cols-1 gap-4">
                <FieldCard 
                  name="Variables" 
                  desc="Dynamic placeholders that change based on user input, usually wrapped in double curly braces." 
                  example="Example Content: 'Convert the following text into a formal email: {{user_notes}}'"
                />
            </div>
          </section>

          <footer className="py-20 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">End of Documentation</p>
          </footer>

        </div>
      </main>
    </div>
  );
};


export default RunbookPage;