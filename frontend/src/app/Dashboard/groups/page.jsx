"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconHome, IconPlane, IconUtensils, IconUsers, IconArrowRight, IconPlus, IconInbox } from "@/components/icons";
import { ModalCrearGrupo } from "@/components/ModalCrearGrupo";

export default function GroupsPage() {
    const [grupos, setGrupos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalCrearGrupo, setModalCrearGrupo] = useState(false);
    const [modalUnirse, setModalUnirse] = useState(false);
    const [tokenInvitacion, setTokenInvitacion] = useState("");
    const [uniendose, setUniendose] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const obtenerGrupos = async () => {
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
                console.error("Error al obtener los grupos del servidor");
            }
        } catch (error) {
            console.error("Error de red:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerGrupos();
    }, []);

    const manejarUnirse = async (e) => {
        e.preventDefault();
        if (!tokenInvitacion.trim()) return;

        setUniendose(true);
        setMensaje(null);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/invitation/${tokenInvitacion.trim()}/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                setMensaje({ tipo: "success", texto: "Te has unido al grupo correctamente" });
                setTokenInvitacion("");
                setModalUnirse(false);
                await obtenerGrupos();
            } else {
                const errorData = await respuesta.json();
                setMensaje({ tipo: "error", texto: errorData.error || "Token de invitacion invalido o expirado" });
            }
        } catch (error) {
            setMensaje({ tipo: "error", texto: "Error de conexion" });
        } finally {
            setUniendose(false);
        }
    };

    const IconoCategoria = ({ category }) => {
        switch (category?.toLowerCase()) {
            case "home": case "piso": return <IconHome size={20} />;
            case "travel": case "viaje": return <IconPlane size={20} />;
            case "food": case "comida": return <IconUtensils size={20} />;
            default: return <IconUsers size={20} />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Mis Grupos</h1>
                    <p className="text-sm text-gray-400">Gestiona tus gastos compartidos entre diferentes grupos.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setModalUnirse(true)}
                        className="border border-gray-600 text-gray-300 hover:text-white hover:border-white text-sm py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                    >
                        <IconInbox size={16} />
                        Unirse a un grupo
                    </button>
                    <button
                        onClick={() => setModalCrearGrupo(true)}
                        className="bg-[#eec24b] text-[#1a1a1a] font-bold text-sm py-2 px-4 rounded-md hover:bg-[#d8ae3e] transition-colors flex items-center gap-2"
                    >
                        <IconPlus size={16} />
                        Crear grupo
                    </button>
                </div>
            </div>

            {cargando ? (
                <p className="text-gray-400 font-mono text-xs">Cargando tus grupos...</p>
            ) : grupos.length === 0 ? (
                <div className="bg-gray-800 rounded-2xl p-10 border border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconUsers size={28} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No perteneces a ningun grupo</h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                        Crea un nuevo grupo para empezar a dividir gastos con amigos, o unete a uno usando un codigo de invitacion.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setModalUnirse(true)}
                            className="border border-gray-600 text-gray-300 hover:text-white hover:border-white text-sm py-2 px-4 rounded-md transition-colors"
                        >
                            Unirse a un grupo
                        </button>
                        <button
                            onClick={() => setModalCrearGrupo(true)}
                            className="bg-[#eec24b] text-[#1a1a1a] font-bold text-sm py-2 px-4 rounded-md hover:bg-[#d8ae3e] transition-colors"
                        >
                            Crear grupo
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {grupos.map((grupo) => (
                        <Link href={`/dashboard/groups/${grupo.id}`} key={grupo.id} className="block group">
                            <div className="bg-gray-800/80 rounded-2xl p-5 border border-gray-700/60 border-l-4 border-l-yellow-400 hover:border-gray-600 transition-all hover:scale-[1.01] h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700 text-gray-400">
                                            <IconoCategoria category={grupo.category} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-yellow-400 transition-colors">
                                        {grupo.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{grupo.description || "Sin descripcion"}</p>
                                </div>

                                <div className="flex justify-between items-baseline mt-6 border-t border-gray-700/40 pt-3">
                                    <span className="text-[10px] font-bold tracking-wider text-gray-400">VER DETALLES</span>
                                    <span className="text-gray-400 group-hover:text-yellow-400">
                                        <IconArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <ModalCrearGrupo
                estaAbierto={modalCrearGrupo}
                alCerrar={() => setModalCrearGrupo(false)}
                onGrupoCreado={obtenerGrupos}
            />

            {modalUnirse && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Unirse a un grupo</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Introduce el codigo de invitacion que recibiste por correo electronico.
                        </p>
                        <form onSubmit={manejarUnirse}>
                            <label className="block text-xs text-gray-400 mb-1">Codigo de invitacion</label>
                            <input
                                type="text"
                                value={tokenInvitacion}
                                onChange={(e) => setTokenInvitacion(e.target.value)}
                                placeholder="Pega aqui el codigo de invitacion"
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-yellow-400"
                                required
                            />

                            {mensaje && (
                                <p className={`text-xs mb-4 ${mensaje.tipo === "success" ? "text-green-400" : "text-red-400"}`}>
                                    {mensaje.texto}
                                </p>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setModalUnirse(false); setMensaje(null); setTokenInvitacion(""); }}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={uniendose}
                                    className="px-4 py-2 bg-[#eec24b] text-[#1a1a1a] font-bold rounded-md hover:bg-[#d8ae3e] transition-colors disabled:opacity-50"
                                >
                                    {uniendose ? "Uniendose..." : "Unirse"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}