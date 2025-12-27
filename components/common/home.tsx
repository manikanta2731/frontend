"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, Bot, User, Wrench, Database, ChevronDown, 
  Plus, Sparkles, Search, Settings2, Paperclip, 
  Terminal, Globe, Cpu, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { callMCPClientAgent, getAllAgents } from '@/service/backend_service';

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
  const [agentsList , setAgentsList] = useState<any>([]);

  const messagesEndRef = useRef<any>(null);

  // --- LOGIC ---
  const scrollToBottom = useCallback(() => {
    // Check if the current reference exists before calling scrollIntoView
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(()=> {
    const getAgents = async () =>{
        try{
            let res : any = await getAllAgents();
            if ( res && res?.data && res?.data?.length > 0) {
                setAgentsList(res.data);
            }
            console.log("agents res ",res)
        }catch (e) {
            console.log(e)
        }
    }

    getAgents();
  },[])

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, scrollToBottom]);

  const simulateAgentWorkflow = async (userInput :any) => {
    setIsProcessing(true);
    try{
        let payload = {"input" : input}
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

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-white overflow-hidden shadow-2xl border-x font-sans">
      
      {/* --- ADVANCED HEADER --- */}
      <header className="h-16 flex items-center justify-between px-6 border-b bg-white/70 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-all"
            >
              <span className="text-xl">{selectedAgent?.icon || <Sparkles className="text-blue-500" size={18}/>}</span>
              <span className="text-sm font-semibold text-gray-700">
                {selectedAgent ? selectedAgent?.name : "Link Agent"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[60]"
                >
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Agents</div>
                  {agentsList.map((agent : any) => (
                    <button 
                      key={agent?.id}
                      onClick={() => { setSelectedAgent(agent); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl group-hover:bg-white group-hover:shadow-sm">
                        {agent?.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-gray-800">{agent?.name}</div>
                        <div className="text-[10px] text-gray-500 flex gap-1">
                          {agent?.tools && agent?.tools?.length > 0 && agent?.tools.join(' • ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><Search size={20}/></button>
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><Settings2 size={20}/></button>
        </div>
      </header>

      {/* --- CHAT VIEWPORT --- */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg : any) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar Section */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'assistant' ? 'bg-blue-50 border-blue-100' : 'bg-gray-900 border-gray-800'
              }`}>
                {msg.role === 'assistant' ? <Bot className="text-blue-600" size={20}/> : <User className="text-white" size={20}/>}
              </div>

              {/* Content Section */}
              <div className={`flex flex-col gap-3 max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Thinking / Tool Execution State */}
                {msg.isThinking && (
                  <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 w-full">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <RefreshCw size={14} className="animate-spin text-blue-500" />
                      {msg.thought}
                    </div>
                    <div className="flex gap-2">
                      {msg.toolsUsed.map((tool :any )=> (
                        <span key={tool} className="px-2 py-0.5 bg-white border rounded text-[10px] font-bold text-gray-600 shadow-sm flex items-center gap-1">
                          {tool === 'RAG' ? <Database size={10}/> : <Wrench size={10}/>}
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                {!msg.isThinking && msg.content && (
                  <div className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <ReactMarkdown 
                        components={{
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 text-blue-700" {...props} />,
                          code: ({node, ...props}) => {
                            // Check for inline via props.className (standard for current ReactMarkdown versions)
                            const isInline = !props.className?.includes('language-');
                            return isInline 
                            ? <code className="bg-gray-200 px-1 rounded text-red-500" {...props}/> 
                            : <code className="block bg-gray-900 text-emerald-400 p-4 rounded-xl my-2 overflow-x-auto text-xs" {...props}/>
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  <span>{msg.role}</span>
                  {msg.timestamp && <span>• {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Placeholder */}
        {isProcessing && !messages[messages.length-1]?.isThinking && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-100" />
            <div className="space-y-2 py-2">
              <div className="h-4 w-48 bg-gray-100 rounded-full" />
              <div className="h-4 w-32 bg-gray-100 rounded-full" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- PREMIUM INPUT FOOTER --- */}
      <footer className="p-6 bg-white">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Quick Action Chips */}
          <div className="flex gap-2 mb-3 px-1 overflow-x-auto no-scrollbar">
             {selectedAgent?.tools && selectedAgent?.tools?.length > 0 && selectedAgent?.tools.map((tool :any) => (
               <button key={tool} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border rounded-full text-[10px] font-bold text-gray-500 flex items-center gap-1 shrink-0 transition-colors">
                 <Plus size={12}/> Run {tool}
               </button>
             ))}
          </div>

          <div className="relative flex items-end gap-3 p-2 pl-4 bg-gray-50 border border-gray-200 rounded-3xl focus-within:bg-white focus-within:border-blue-400 focus-within:shadow-2xl transition-all duration-300">
            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors mb-1">
              <Paperclip size={20} />
            </button>
            
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : "Link an agent or ask me anything..."}
              className="flex-1 py-3 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400 max-h-40 resize-none"
              style={{ minHeight: '44px' }}
            />

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className={`p-3 rounded-2xl mb-1 shadow-lg transition-all ${
                input.trim() && !isProcessing 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Send size={20} />
            </motion.button>
          </div>

          <div className="mt-3 flex items-center justify-between px-4">
             <div className="flex gap-4">
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                  <Cpu size={12} className="text-emerald-500"/> MCP v2.1 ACTIVE
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                  <Database size={12} className="text-blue-500"/> RAG INDEXED
                </span>
             </div>
             <p className="text-[10px] text-gray-400">
               MCP can make mistakes. Verify important info.
             </p>
          </div>
        </div>
      </footer>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default HomePage;