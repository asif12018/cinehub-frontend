"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/module/dashboard/adminSidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-card">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-30">
        <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          CineTube Admin
        </span>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 bg-muted hover:bg-gray-700 rounded-lg text-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar closeMobile={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[100vw] md:max-w-none overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
