"use client";

import React, { useEffect, useState } from "react";
import { IconInbox, IconX } from "./icons";

export const ModalBandejaAmistad = ({ estaAbierto, alCerrar }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [procesandoId, setProcesandoId] = useState(null);

    const obtenerSolicitudes = async () => {
        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch("http://localhost:5000/friends/requests", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                setSolicitudes(datos);
            }
        } catch (error) {
            console.error("Error al obtener solicitudes:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (!estaAbierto) return;
        obtenerSolicitudes();
    }, [estaAbierto]);

    const aceptarSolicitud = async (requestId) => {
        setProcesandoId(requestId);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/friends/request/${requestId}/accept`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (respuesta.ok) {
                setSolicitudes(solicitudes.filter(s => s.id !== requestId));
            } else {
                const error = await respuesta.json();
                alert(error.error || "Error al aceptar la solicitud");
            }
        } catch (error) {
            console.error("Error al aceptar solicitud:", error);
        } finally {
            setProcesandoId(null);
        }
    };

    const rechazarSolicitud = async (requestId) => {
        setProcesandoId(requestId);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/friends/request/${requestId}/reject`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (respuesta.ok) {
                setSolicitudes(solicitudes.filter(s => s.id !== requestId));
            } else {
                const error = await respuesta.json();
                alert(error.error || "Error al rechazar la solicitud");
            }
        } catch (error) {
            console.error("Error al rechazar solicitud:", error);
        } finally {
            setProcesandoId(null);
        }
    };

    if (!estaAbierto) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/80 w-full max-w-md text-white shadow-2xl flex flex-col max-h-[80vh]">
                
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <IconInbox size={22} /> Bandeja de solicitudes
                    </h3>
                    <button onClick={alCerrar} className="text-gray-400 hover:text-white transition-colors">
                        <IconX size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
                    {cargando ? (
                        <p className="text-center text-sm text-gray-400 py-4">Cargando solicitudes...</p>
                    ) : solicitudes.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 italic py-6">No tienes solicitudes pendientes.</p>
                    ) : (
                        solicitudes.map((solicitud) => (
                            <div key={solicitud.id} className="flex items-center gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-black flex items-center justify-center font-bold text-sm shrink-0">
                                    {(solicitud.user?.name || solicitud.user?.user_name || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate text-gray-200">
                                        {solicitud.user?.name || solicitud.user?.user_name || `Usuario #${solicitud.user_id}`}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {solicitud.user?.email || `ID: ${solicitud.user_id}`}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => aceptarSolicitud(solicitud.id)}
                                        disabled={procesandoId === solicitud.id}
                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => rechazarSolicitud(solicitud.id)}
                                        disabled={procesandoId === solicitud.id}
                                        className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 border border-red-800/50"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end">
                    <button onClick={alCerrar} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm font-medium rounded-md transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
