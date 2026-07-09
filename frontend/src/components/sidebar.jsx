"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModales } from "../app/context/ModalContext";
import { ModalListaAmigos } from "./ModalListaAmigos";
import { ModalBandejaAmistad } from "./ModalBandejaAmistad";
import { IconUser, IconFolder, IconPlus, IconChevronDown, IconChevronLeft, IconChevronRight, IconMoney, IconUsers, IconFriends, IconInbox, IconActivity, IconX } from "./icons";

const Sidebar = () => {
  const router = useRouter();
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const { setModalGasto, sidebarCollapsed, setSidebarCollapsed } = useModales();
  const [verAmigos, setVerAmigos] = useState(false);
  const [verBandeja, setVerBandeja] = useState(false);
  const [username, setUsername] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(false);
  const [pendientesCount, setPendientesCount] = useState(0);
  const [tieneGrupos, setTieneGrupos] = useState(false);
  const [gruposCargados, setGruposCargados] = useState(false);

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
    const verificarGrupos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const respuesta = await fetch("http://localhost:5000/groups", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setTieneGrupos(datos.length > 0);
        }
      } catch (error) {
        console.error("Error al verificar grupos:", error);
      } finally {
        setGruposCargados(true);
      }
    };
    verificarGrupos();
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

  useEffect(() => {
    if (isGroupsOpen && grupos.length === 0) {
      const obtenerGruposSidebar = async () => {
        setCargandoGrupos(true);
        try {
          const token = localStorage.getItem("token");
          const respuesta = await fetch("http://localhost:5000/groups", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          if (respuesta.ok) {
            const datos = await respuesta.json();
            setGrupos(datos);
          } else {
            console.error("Error al consultar la lista de grupos");
          }
        } catch (error) {
          console.error("Error de red al traer grupos del sidebar:", error);
        } finally {
          setCargandoGrupos(false);
        }
      };

      obtenerGruposSidebar();
    }
  }, [isGroupsOpen]);

  const toggleGroups = () => {
    setIsGroupsOpen(!isGroupsOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const sidebarWidth = sidebarCollapsed ? "w-[60px]" : "w-[240px]";

  return (
    <>
      <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] bg-[#1a1a1a] text-[#ae9f8f] flex flex-col p-3 box-border shadow-2xl border-r border-neutral-900 transition-all duration-300 ${sidebarWidth}`}>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-4 w-6 h-6 bg-[#eec24b] text-[#1a1a1a] rounded-full flex items-center justify-center shadow-md hover:bg-[#d8ae3e] transition-colors z-50"
          title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {sidebarCollapsed ? <IconChevronRight size={12} /> : <IconChevronLeft size={12} />}
        </button>

        {!sidebarCollapsed && gruposCargados && (
          tieneGrupos ? (
            <button
              className="w-full bg-[#eec24b] text-[#1a1a1a] py-3 rounded-xl font-bold text-sm hover:bg-[#d8ae3e] transition-colors mb-6 shadow-md shadow-[#eec24b]/10 flex items-center justify-center gap-2"
              onClick={() => setModalGasto(true)}
            >
              <IconPlus size={16} /> Agregar gasto
            </button>
          ) : (
            <Link
              href="/dashboard/groups"
              className="w-full bg-neutral-800 text-[#ae9f8f] py-3 rounded-xl font-bold text-sm hover:bg-neutral-700 transition-colors mb-6 flex items-center justify-center gap-2 border border-neutral-700"
            >
              <IconUsers size={16} /> Unete a un grupo
            </Link>
          )
        )}

        {sidebarCollapsed && gruposCargados && (
          tieneGrupos ? (
            <button
              className="w-full bg-[#eec24b] text-[#1a1a1a] py-2 rounded-lg font-bold hover:bg-[#d8ae3e] transition-colors mb-4 shadow-md shadow-[#eec24b]/10 flex items-center justify-center"
              onClick={() => setModalGasto(true)}
              title="Agregar gasto"
            >
              <IconPlus size={16} />
            </button>
          ) : (
            <Link
              href="/dashboard/groups"
              className="w-full bg-neutral-800 text-[#ae9f8f] py-2 rounded-lg font-bold hover:bg-neutral-700 transition-colors mb-4 flex items-center justify-center border border-neutral-700"
              title="Unete a un grupo"
            >
              <IconUsers size={16} />
            </Link>
          )
        )}

        <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
          {sidebarCollapsed ? (
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-800/60 transition-colors text-[#ae9f8f] hover:text-[#f3dfc1]" title="Tus gastos">
                  <IconMoney size={20} />
                </Link>
              </li>
              <li>
                <button onClick={toggleGroups} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-800/60 transition-colors text-[#ae9f8f] hover:text-[#f3dfc1]" title="Grupos">
                  <IconUsers size={20} />
                </button>
              </li>
              <li>
                <div onClick={() => setVerAmigos(true)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-800/60 transition-colors cursor-pointer text-[#ae9f8f] hover:text-[#f3dfc1]" title="Amigos">
                  <IconFriends size={20} />
                </div>
              </li>
              <li>
                <div onClick={() => setVerBandeja(true)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-800/60 transition-colors cursor-pointer relative text-[#ae9f8f] hover:text-[#f3dfc1]" title="Bandeja de solicitudes">
                  <IconInbox size={20} />
                  {pendientesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {pendientesCount > 9 ? "9+" : pendientesCount}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <Link href="/activity" className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-800/60 transition-colors text-[#ae9f8f] hover:text-[#f3dfc1]" title="Actividad">
                  <IconActivity size={20} />
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="space-y-1.5">
              <li>
                <Link href="/dashboard" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-800/60 hover:text-[#f3dfc1] transition-colors text-sm">
                  <IconMoney size={18} />
                  <span>Tus gastos</span>
                </Link>
              </li>

              <li>
                <button
                  onClick={toggleGroups}
                  className={`w-full p-2.5 rounded-xl flex justify-between items-center transition-colors text-sm
                  ${isGroupsOpen ? 'bg-[#008744] text-white font-medium' : 'hover:bg-neutral-800/60 hover:text-[#f3dfc1]'}`}
                >
                  <span className="flex items-center gap-3">
                    <IconUsers size={18} />
                    <span>Grupos</span>
                  </span>
                  <IconChevronDown size={10} className={`transition-transform duration-200 ${isGroupsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isGroupsOpen && (
                  <div className="pl-3 pt-1 pb-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {cargandoGrupos ? (
                      <div className="pl-2 py-1.5 text-xs text-gray-500 font-mono animate-pulse">
                        Cargando grupos...
                      </div>
                    ) : grupos.length === 0 ? (
                      <div className="pl-2 py-1.5 text-xs text-gray-500 italic">
                        Aun no tienes grupos.
                      </div>
                    ) : (
                      <div className="max-h-36 overflow-y-auto space-y-0.5 pr-1 border-l border-neutral-800 ml-1.5">
                        {grupos.map((grupo) => (
                          <Link
                            key={grupo.id}
                            href={`/dashboard/groups/${grupo.id}`}
                            className="flex items-center gap-2 pl-3 py-1.5 text-xs text-gray-400 hover:text-[#eec24b] rounded-lg hover:bg-neutral-800/40 transition-colors truncate"
                          >
                            <IconFolder size={12} />
                            {grupo.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>

              <li className="list-none m-0 p-0 w-full">
                <div
                  onClick={() => setVerAmigos(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#a19587] hover:bg-[#1a1919] hover:text-[#f4efe8] transition-all duration-150 cursor-pointer select-none group"
                >
                  <IconFriends size={20} />
                  <span className="tracking-wide">Amigos</span>
                </div>
              </li>

              <li className="list-none m-0 p-0 w-full">
                <div
                  onClick={() => setVerBandeja(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#a19587] hover:bg-[#1a1919] hover:text-[#f4efe8] transition-all duration-150 cursor-pointer select-none group relative"
                >
                  <IconInbox size={20} />
                  <span className="tracking-wide">Bandeja</span>
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

        <div className="mt-auto pt-4 border-t border-neutral-800/60">
          {sidebarCollapsed ? (
            <>
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-neutral-800/40 transition-all group"
                title={username}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center group-hover:border-[#eec24b] transition-colors shrink-0">
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
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-800/40 transition-all group text-left"
              >
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center group-hover:border-[#eec24b] transition-colors shrink-0">
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
                  <h3 className="text-[#f3dfc1] font-medium text-xs truncate group-hover:text-[#eec24b] transition-colors">
                    {username}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-0.5">
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