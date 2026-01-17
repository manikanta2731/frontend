"use client";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, UserSquare2, Wrench, Terminal,
  Database, BookOpen, CreditCard, LayoutGrid
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Home", href: "/", icon: Home },
    { name: "Agents", href: "/agents", icon: UserSquare2 },
    { name: "Tools", href: "/tools", icon: Wrench },
    { name: "Prompts", href: "/prompts", icon: Terminal },
    { name: "RAG", href: "/rag", icon: Database },
    { name: "Runbook", href: "/runbook", icon: BookOpen },
    { name: "Billing", href: "/subscriptions", icon: CreditCard },
  ];

  return (
    <aside className="w-72 h-screen bg-[#f8fafc] border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <LayoutGrid className="text-white" size={24} />
        </div>
        <span className="font-black text-xl tracking-tighter text-slate-800">
          MCP<span className="text-indigo-600">.</span>CORE
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menu.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                  ? "bg-white shadow-md shadow-slate-200/50 text-indigo-600 border border-slate-100"
                  : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
            >
              <Icon size={20} className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className={`text-sm font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}>
                {item.name}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 m-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl">
        <p className="text-white text-xs font-bold opacity-80 mb-1">Compute Power</p>
        <div className="h-1.5 w-full bg-indigo-400/30 rounded-full overflow-hidden">
          <div className="h-full bg-white w-3/4 rounded-full" />
        </div>
        <p className="text-white/60 text-[10px] mt-2 font-medium">75% capacity utilized</p>
      </div>
    </aside>
  );
};

export default Sidebar;