"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  // Use React Router's location hook instead of Next.js
  const location = useLocation();

  const menu = [
    { name: "Home", href: "/" },
    { name: "Agents", href: "/agents" },
    { name: "Tools", href: "/tools" },
    { name: "Prompts", href: "/prompts" },
    { name: "RAG", href: "/rag" },
    { name: "Runbook", href: "/runbook" },
    { name: "Subscriptions", href: "/subscriptions" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col shrink-0">
      <div className="p-4 font-bold text-xl text-black border-b">
        MCP Platform
      </div>

      <nav className="flex flex-col gap-2 px-3 mt-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            to={item.href} // React Router uses 'to' instead of 'href'
            className={`px-3 py-2 rounded-md transition-colors ${
              location.pathname === item.href
                ? "bg-gray-200 font-medium text-black"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;