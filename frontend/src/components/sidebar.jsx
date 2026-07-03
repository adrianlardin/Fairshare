"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModales } from "../app/context/ModalContext";
import { ModalListaAmigos } from "./ModalListaAmigos";

const Sidebar = () => {
  const router = useRouter();
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const { setModalGasto } = useModales();
  const [verAmigos, setVerAmigos] = useState(false);
  const [username, setUsername] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState('');

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

  const toggleGroups = () => {
    setIsGroupsOpen(!isGroupsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <aside className="fixed top-16 left-0 z-40 w-[240px] h-[calc(100vh-64px)] bg-[#1a1a1a] text-[#ae9f8f] flex flex-col p-5 box-border shadow-2xl border-r border-neutral-900">

        <button
          className="w-full bg-[#eec24b] text-[#1a1a1a] py-3 rounded-xl font-bold text-sm hover:bg-[#d8ae3e] transition-colors mb-6 shadow-md shadow-[#eec24b]/10 flex items-center justify-center gap-2"
          onClick={() => setModalGasto(true)}
        >
          <span>+</span> Agregar gasto
        </button>

        <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
          <ul className="space-y-1.5">
            <li>
              <Link href="/dashboard" className="block p-2.5 rounded-xl hover:bg-neutral-800/60 hover:text-[#f3dfc1] transition-colors text-sm">
                Tus gastos
              </Link>
            </li>

            <li>
              <button
                onClick={toggleGroups}
                className={`w-full p-2.5 rounded-xl flex justify-between items-center transition-colors text-sm
                ${isGroupsOpen ? 'bg-[#008744] text-white font-medium' : 'hover:bg-neutral-800/60 hover:text-[#f3dfc1]'}`}
              >
                <span>Grupos</span>
                <span className={`text-[10px] transition-transform duration-200 ${isGroupsOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isGroupsOpen && (
                <div className="pl-4 pt-2 pb-1 text-xs text-gray-500 italic animate-in fade-in slide-in-from-top-1 duration-200">
                  Aún no tienes grupos.
                </div>
              )}
            </li>

            <li className="list-none m-0 p-0 w-full">
              <div
                onClick={() => setVerAmigos(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#a19587] hover:bg-[#1a1919] hover:text-[#f4efe8] transition-all duration-150 cursor-pointer select-none group"
              >
                <span className="text-base flex items-center justify-center min-w-[24px] opacity-70 group-hover:opacity-100 transition-opacity">
                  👥
                </span>
                <span className="tracking-wide">Amigos</span>
              </div>
            </li>

            <li>
              <Link href="/activity" className="block p-2.5 rounded-xl hover:bg-neutral-800/60 hover:text-[#f3dfc1] transition-colors text-sm">
                Actividad
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-neutral-800/60">
          {/* ================================================================================= */}
          {/* PARTE MODIFICADA: Cambié el elemento <button> por este componente <Link>       */}
          {/* y configuré el href="/user/Dashboard" para corregir el error 404 que habia comentado en el grupo.*/}
          {/* ================================================================================= */}
          <Link
            href="/user/Dashboard"
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-800/40 transition-all group text-left"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center group-hover:border-[#eec24b] transition-colors shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar de usuario"
                  className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>

            <div className="overflow-hidden">
              <h3 className="text-[#f3dfc1] font-medium text-xs truncate group-hover:text-[#eec24b] transition-colors">
                {username}
              </h3>
              <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                Configuración
              </p>
            </div>
          </Link>

         {/* Tambien agregué un botón de cerrar sesión directamente el aquí, para que se aun poco más rápido, pero sientete libre de quitarlo o modificarlo*/}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 mt-2 rounded-xl text-red-400 hover:bg-red-900/10 hover:text-red-300 transition-all text-xs font-medium"
          >
            <span className="ml-1">🚪</span> Cerrar sesión
          </button>
        </div>

      </aside>
      <ModalListaAmigos
        estaAbierto={verAmigos}
        alCerrar={() => setVerAmigos(false)} />
    </>
  );
};

export default Sidebar;