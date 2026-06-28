"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Imagen de usuario comentada por el momento para no romper la app
//import userPhoto from '../public/images/user.png';

const Sidebar = () => {
    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const toggleGroups = () => {
        setIsGroupsOpen(!isGroupsOpen);
    };
  return (
    <aside className="fixed top-0 left-0 z-50 w-[260px] h-screen bg-[#1a1a1a] text-[#ae9f8f] flex flex-col p-6 box-border shadow-2xl">
      {/* perfil de usuario comentado por el momento para no romper la app */}
      {/* Perfil de usuario */}
      {/* <div className="flex items-center gap-3 mb-8">
        <Image 
          src={userPhoto} 
          alt="Foto de perfil" 
          width={45} 
          height={45} 
          className="rounded-xl object-cover"
        />
        <div>
          <h2 className="text-[#f3dfc1] font-semibold text-lg leading-tight">SplitSync</h2>
          <p className="text-xs text-gray-400">Manage Debts</p>
        </div>
      </div> */}

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block p-3 rounded-lg hover:bg-neutral-800 transition-colors">
              Tus gastos
            </Link>
          </li>
          <li>
                      <button
                          onClick={toggleGroups}
                          className={`w-full block p-3 rounded-xl flex justify-between items-center transition-colors 
                                ${isGroupsOpen ? 'bg-[#008744] text-white font-medium' : 'hover:bg-neutral-800'}`}
                      >
                          <span>Grupos</span>
                          <span className={`text-xs transition-transform ${isGroupsOpen ? 'rotate-180' : ''}`}>▼</span>
                      </button>

                      {isGroupsOpen && (
                          <div className="pl-6 pt-2 pb-1 text-sm text-gray-500 italic">
                              Aun no tienes grupos.
                          </div>
                      )}
          </li>
          <li>
            <Link href="/friends" className="block p-3 rounded-lg hover:bg-neutral-800 transition-colors">
              Amigos
            </Link>
          </li>
          <li>
            <Link href="/activity" className="block p-3 rounded-lg hover:bg-neutral-800 transition-colors">
              Actividad
            </Link>
          </li>
          <li>
            <Link href="/user/dashboard" className="block p-3 rounded-lg hover:bg-neutral-800 transition-colors">
              Perfil
            </Link>
          </li>
        </ul>
      </nav>

      <button className="w-full bg-[#eec24b] text-[#1a1a1a] py-3.5 rounded-xl font-bold text-base hover:bg-[#d8ae3e] transition-colors mt-auto">
        + Agregar gasto
      </button>

    </aside>
  );
};

export default Sidebar;