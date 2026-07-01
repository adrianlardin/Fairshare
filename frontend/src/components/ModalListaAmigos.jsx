"use client";

import React, { useEffect, useState } from "react";

export const ModalListaAmigos = ({ estaAbierto, alCerrar }) => {
    const [amigos, setAmigos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!estaAbierto) return;

        const obtenerAmigos = async () => {
            setCargando(true);
            try {
                const token = localStorage.getItem("token");
                const respuesta = await fetch("http://localhost:5000/friends", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setAmigos(datos);
                }
            } catch (error) {
                console.error("Error al obtener amigos:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAmigos();
    }, [estaAbierto]);

    if (!estaAbierto) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md text-white shadow-2xl flex flex-col max-h-[80vh]">
                
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                    <h3 className="text-xl font-bold flex items-center gap-2">👥 Mis Amigos</h3>
                    <button onClick={alCerrar} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
                    {cargando ? (
                        <p className="text-center text-sm text-gray-400 py-4">Cargando amigos...</p>
                    ) : amigos.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 italic py-6">Aún no has añadido amigos.</p>
                    ) : (
                        amigos.map((amigo) => (
                            <div key={amigo.id} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-black flex items-center justify-center font-bold text-sm">
                                    {(amigo.name || amigo.user_name || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate text-gray-200">{amigo.name || amigo.user_name}</p>
                                    <p className="text-xs text-gray-500 truncate">{amigo.email || "@username"}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end">
                    <button onClick={alCerrar} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm font-medium rounded-md">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};