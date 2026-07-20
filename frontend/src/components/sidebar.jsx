"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModales } from "../app/context/ModalContext";
import { IconUser, IconChevronLeft, IconChevronRight, IconMoney, IconUsers, IconFriends, IconInbox, IconActivity, IconX } from "./icons";

const Sidebar = () => {
  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed } = useModales();
  const [username, setUsername] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState('');
  

 useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.user_name) setUsername(parsedUser.user_name);
          if (parsedUser.avatar) setAvatarUrl(parsedUser.avatar);
        } catch (error) {
          console.error("Error al parsear el usuario:", error);
        }
      }
    };

    loadUserData();

    window.addEventListener("userUpdated", loadUserData);
    return () => window.removeEventListener("userUpdated", loadUserData);
  }, []);

  
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const sidebarWidth = sidebarCollapsed ? "w-[60px]" : "w-[240px]";

  return (
    <>
      <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] bg-[#0b0f14] text-slate-400 flex flex-col p-3 box-border shadow-2xl border-r border-white/10 transition-all duration-300 ${sidebarWidth}`}>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-4 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors z-50"
          title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {sidebarCollapsed ? <IconChevronRight size={12} /> : <IconChevronLeft size={12} />}
        </button>

        <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
          {sidebarCollapsed ? (
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-700/60 transition-colors text-slate-400 hover:text-slate-200" title="Tus gastos">
                  <IconMoney size={20} />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/groups" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-700/60 transition-colors text-slate-400 hover:text-slate-200" title="Grupos">
                  <IconUsers size={20} />
                </Link>
              </li>
              
            </ul>
          ) : (
            <ul className="space-y-1.5">
              <li>
                <Link href="/dashboard" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-700/60 hover:text-slate-200 transition-colors text-sm">
                  <IconMoney size={18} />
                  <span>Tus gastos</span>
                </Link>
              </li>

              <li>
                <Link href="/dashboard/groups" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-700/60 hover:text-slate-200 transition-colors text-sm">
                  <IconUsers size={18} />
                  <span>Grupos</span>
                </Link>
              </li>

              
            </ul>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-700/60">
          {sidebarCollapsed ? (
            <>
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-slate-700/40 transition-all group"
                title={username}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-600 bg-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar de usuario"
                      className="w-full h-full object-cover" />
                  ) : (
                    <IconUser size={18} />
                  )}
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-red-500/20 transition-all group mt-1"
                title="Cerrar sesión"
              >
                <IconX size={18} className="text-red-400 group-hover:text-red-300" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/40 transition-all group text-left"
              >
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-600 bg-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar de usuario"
                      className="w-full h-full object-cover" />
                  ) : (
                    <IconUser size={18} />
                  )}
                </div>

                <div className="overflow-hidden">
                  <h3 className="text-slate-200 font-medium text-xs truncate group-hover:text-blue-400 transition-colors">
                    {username}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
                    Configuracion
                  </p>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/20 transition-all group text-left mt-1"
              >
                <IconX size={18} className="text-red-400 group-hover:text-red-300" />
                <span className="text-red-400 text-xs group-hover:text-red-300 transition-colors">Cerrar sesión</span>
              </button>
            </>
          )}
        </div>

      </aside>
     
    </>
  );
};

export default Sidebar;