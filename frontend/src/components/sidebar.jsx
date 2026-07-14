"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModales } from "../app/context/ModalContext";
import { ModalListaAmigos } from "./ModalListaAmigos";
import { ModalBandejaAmistad } from "./ModalBandejaAmistad";
import { IconUser, IconChevronLeft, IconChevronRight, IconMoney, IconUsers, IconFriends, IconInbox, IconActivity, IconX } from "./icons";

const Sidebar = () => {
  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed } = useModales();
  const [verAmigos, setVerAmigos] = useState(false);
  const [verBandeja, setVerBandeja] = useState(false);
  const [username, setUsername] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [pendientesCount, setPendientesCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) setUsername(`${parsedUser.name} ${parsedUser.lastName || ''}`);
        if (parsedUser.avatar) setAvatarUrl(parsedUser.avatar);
      } catch (error) {
        console.error("Error al parsear el usuario desde localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const obtenerPendientes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const respuesta = await fetch("http://localhost:5000/friends/requests", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setPendientesCount(Array.isArray(datos) ? datos.length : 0);
        } else if (respuesta.status === 401) {
          setPendientesCount(0);
        }
      } catch (error) {
        console.error("Error al consultar solicitudes pendientes:", error);
      }
    };
    obtenerPendientes();
    const intervalo = setInterval(obtenerPendientes, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const sidebarWidth = sidebarCollapsed ? "w-[60px]" : "w-[240px]";

  return (
    <>
      <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] bg-slate-800 text-slate-400 flex flex-col p-3 box-border shadow-2xl border-r border-slate-800 transition-all duration-300 ${sidebarWidth}`}>

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
              <li>
                <div onClick={() => setVerAmigos(true)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-700/60 transition-colors cursor-pointer text-slate-400 hover:text-slate-200" title="Amigos">
                  <IconFriends size={20} />
                </div>
              </li>
              <li>
                <div onClick={() => setVerBandeja(true)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-700/60 transition-colors cursor-pointer relative text-slate-400 hover:text-slate-200" title="Bandeja de solicitudes">
                  <IconInbox size={20} />
                  {pendientesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {pendientesCount > 9 ? "9+" : pendientesCount}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <Link href="/activity" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-700/60 transition-colors text-slate-400 hover:text-slate-200" title="Actividad">
                  <IconActivity size={20} />
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

              <li>
                <div
                  onClick={() => setVerAmigos(true)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-700/60 hover:text-slate-200 transition-colors text-sm cursor-pointer"
                >
                  <IconFriends size={18} />
                  <span>Amigos</span>
                </div>
              </li>

              <li>
                <div
                  onClick={() => setVerBandeja(true)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-700/60 hover:text-slate-200 transition-colors text-sm cursor-pointer relative"
                >
                  <IconInbox size={18} />
                  <span>Bandeja</span>
                  {pendientesCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">
                      {pendientesCount > 99 ? "99+" : pendientesCount}
                    </span>
                  )}
                </div>
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
      <ModalListaAmigos
        estaAbierto={verAmigos}
        alCerrar={() => setVerAmigos(false)} />
      <ModalBandejaAmistad
        estaAbierto={verBandeja}
        alCerrar={() => {
          setVerBandeja(false);
          const token = localStorage.getItem("token");
          if (token) {
            fetch("http://localhost:5000/friends/requests", {
              headers: { "Authorization": `Bearer ${token}` }
            }).then(r => r.json()).then(d => {
              setPendientesCount(Array.isArray(d) ? d.length : 0);
            }).catch(() => {});
          }
        }} />
    </>
  );
};

export default Sidebar;