"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Bot, User, Wrench, Database, ChevronDown,
  Sparkles, Search, Settings2, Paperclip,
  Cpu, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { callMCPClientAgent, getAllAgents } from '@/service/tool_service';

const HomePage = () => {
  const [messages, setMessages] = useState<any>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to the MCP Environment. Link an agent to begin specialized workflows.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState<any>(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<any>(false);
  const [agentsList, setAgentsList] = useState<any>([]);

  const messagesEndRef = useRef<any>(null);

  // --- LOGIC ---
  const scrollToBottom = useCallback(() => {
    // Check if the current reference exists before calling scrollIntoView
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const getAgents = async () => {
      try {
        let res: any = await getAllAgents();
        if (res && res?.length > 0) {
          setAgentsList(res);
        }
        console.log("agents res ", res)
      } catch (e) {
        console.log(e)
      }
    }

    getAgents();
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, scrollToBottom]);

  const simulateAgentWorkflow = async (userInput: any) => {
    setIsProcessing(true);
    try {
      let payload = { "input": input }
      let res = await callMCPClientAgent(selectedAgent, payload);
      if (res && res?.result) {
        const aimessage = { id: Date.now() + 'u', role: 'assistant', content: res?.result, timestamp: new Date() };
        setMessages((prev: any) => [...prev, aimessage]);
      }
      setIsProcessing(false);
    } catch (e) {
      setIsProcessing(false)
      console.log(e);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    const userMsg = { id: Date.now() + 'u', role: 'user', content: input, timestamp: new Date() };
    setMessages((prev: any) => [...prev, userMsg]);
    setInput('');
    simulateAgentWorkflow(input);
  };

  const glassHeaderStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] relative overflow-hidden">

      {/* Header */}
      <header className="h-20 flex items-center justify-between px-10 z-50 sticky top-0" style={glassHeaderStyle}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-5 py-2.5 bg-white shadow-sm hover:shadow-md rounded-2xl border border-slate-200 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                {selectedAgent ? <Cpu size={18} /> : <Sparkles size={18} />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Linked Agent</p>
                <p className="text-sm font-bold text-slate-800 leading-none">
                  {selectedAgent ? selectedAgent?.name : "Select Coordinator"}
                </p>
              </div>
              <ChevronDown size={14} className={`ml-2 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                  className="absolute top-full left-0 mt-3 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-3 z-[60]"
                >
                  {agentsList.map((agent: any) => (
                    <button
                      key={agent?.id}
                      onClick={() => { setSelectedAgent(agent); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <User size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{agent?.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Equipped with {agent?.tool_ids?.length || 0} Tools</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">MCP Client Online</span>
          </div>
        </div>
      </header>

      {/* Chat Viewport */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-0 py-10 scroll-smooth space-y-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {messages.map((msg: any) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                  <Bot className="text-indigo-600" size={20} />
                </div>
              )}

              <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-[28px] shadow-sm ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                  <div className="prose prose-slate max-w-none text-[15px] leading-relaxed">
                    <ReactMarkdown
                      components={{
                        // Keep your custom code block styling from earlier
                        code: ({ node, ...props }) => {
                          const isInline = !props.className?.includes('language-');
                          return isInline
                            ? <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-sm" {...props} />
                            : <code className="block bg-slate-900 text-emerald-400 p-4 rounded-2xl my-3 overflow-x-auto text-xs shadow-inner font-mono" {...props} />
                        },
                        // Ensure links look good
                        a: ({ node, ...props }) => <a className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-500 transition-all" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  {msg.role} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg shrink-0">
                  <User className="text-white" size={20} />
                </div>
              )}
            </motion.div>
          ))}
          {isProcessing && (
            <div className="flex gap-4 items-center text-slate-400">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">Agent is processing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <footer className="p-10 pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white border border-slate-200 rounded-[32px] shadow-2xl shadow-slate-200/50 p-2 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedAgent ? `Command ${selectedAgent.name}...` : "Link an agent..."}
              className="w-full py-4 px-6 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-300 resize-none min-h-[60px]"
            />
            <div className="flex items-center justify-between px-4 pb-2">
              <div className="flex gap-2">
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Paperclip size={20} /></button>
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Layers size={20} /></button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <span>Send</span>
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;