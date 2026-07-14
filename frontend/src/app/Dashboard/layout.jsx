"use client";

import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useModales } from "../context/ModalContext";

export default function DashboardLayout({ children }) {
  const { sidebarCollapsed } = useModales();

  return (
    <div className="bg-slate-900 min-h-screen text-white relative">
      <Navbar />
      <Sidebar />
      <div className={`pt-24 px-6 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        {children}
      </div>
    </div>
  );
}
