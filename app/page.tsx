"use client";

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import HomePage from '../components/common/home';
import ToolLanding from '@/components/tools/toollanding';
import PromptLanding from '@/components/prompts/promptlanding';
import RagLanding from '@/components/rag/raglanding';
import AgentLanding from '@/components/agents/agentlanding';

/**
 * ClientOnly Component
 * Prevents hydration mismatch errors in Next.js by ensuring 
 * the router only initializes on the client side.
 */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return <>{children}</>;
}

/**
 * SPAHost Component
 * Uses a Next.js catch-all route to host a full React Router SPA.
 * This allows you to manage all routing inside this file and 
 * organize your folders however you wish.
 */
export default function SPAHost() {
  return (
    <ClientOnly>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          {/* Persistent Sidebar */}
          <Sidebar />
          
          {/* Dynamic Content Area */}
          <main className="flex-1 overflow-auto" style={{ padding: '2rem' }}>
            <Routes>
              {/* Main Landing Page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Placeholder Routes - Replace these with your actual components as you build them */}
              <Route path="/agents" element={<AgentLanding/>} />
              <Route path="/tools" element={<ToolLanding/>}/>
              <Route path="/prompts" element={<PromptLanding/>} />
              <Route path="/rag" element={<RagLanding/>} />
              <Route path="/runbook" element={<div className="p-8"><h1>Runbooks</h1><p>Automated execution flows.</p></div>} />
              <Route path="/subscriptions" element={<div className="p-8"><h1>Subscriptions</h1><p>Manage your billing and plans.</p></div>} />
              
              {/* 404 Fallback */}
              <Route path="*" element={<div className="p-8"><h1>404</h1><p>Page not found in SPA routing.</p></div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ClientOnly>
  );
}