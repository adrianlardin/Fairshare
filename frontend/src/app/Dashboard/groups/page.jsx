"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconHome, IconPlane, IconUtensils, IconUsers, IconArrowRight } from "@/components/icons";

export default function GroupsPage() {
    const [grupos, setGrupos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerGruposBackend = async () => {
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

        obtenerGruposBackend();
    }, []);

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
            </div>

            {cargando ? (
                <p className="text-gray-400 font-mono text-xs">Cargando tus grupos...</p>
            ) : grupos.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No perteneces a ningun grupo todavia.</p>
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
        </div>
    );
}
