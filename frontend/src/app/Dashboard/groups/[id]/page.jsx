"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModalAjustesGrupo } from "@/components/ModalAjustesGrupo";
// IMPORTANTE: Importamos el contexto de tus modales globales
import { useModales } from "@/app/context/ModalContext";
import { IconHome, IconSettings, IconPlus, IconReceipt, IconUser, IconDollar, IconFilter } from "@/components/icons";

export default function GroupDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    // Extraemos las acciones del Contexto global
    const { setModalGasto, setModalLiquidar, refrescoTrigger } = useModales();
    // Nota: Si en tu ModalContext tienes una variable de estado que cambia al llamar a refrescarDatos() 
    // (por ejemplo un contador o un booleano tipo 'refrescoTrigger'), la añadimos a los dependencies del useEffect.

    const [grupo, setGrupo] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [verAjustes, setVerAjustes] = useState(false);

    const cargarDatosGrupo = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const [resGrupo, resMiembros, resGastos] = await Promise.all([
                fetch(`http://localhost:5000/groups/${id}`, { headers }),
                fetch(`http://localhost:5000/groups/${id}/members`, { headers }),
                fetch(`http://localhost:5000/groups/${id}/expenses`, { headers })
            ]);

            if (resGrupo.ok && resMiembros.ok && resGastos.ok) {
                const dataGrupo = await resGrupo.json();
                const dataMiembros = await resMiembros.json();
                const dataGastos = await resGastos.json();

                setGrupo(dataGrupo);
                setMiembros(dataMiembros);
                setGastos(dataGastos);
            } else {
                console.error("Error al procesar la informacion del grupo.");
            }
        } catch (error) {
            console.error("Error de comunicacion con el backend:", error);
        } finally {
            setCargando(false);
        }
    };

    // Sincronizamos la carga de datos del grupo con el ID y el trigger global de refresco
    useEffect(() => {
        if (id) cargarDatosGrupo();
    }, [id, refrescoTrigger]); // Si refrescoTrigger cambia en tu Context, esta página se actualiza sola automáticamente.

    if (cargando) return <div className="text-white flex items-center justify-center font-mono text-xs py-10">Cargando...</div>;
    if (!grupo) return <div className="text-white flex items-center justify-center py-10">Grupo no encontrado.</div>;

    const totalExpensesSum = gastos.reduce((acc, current) => acc + (current.amount || 0), 0);

    return (
        <div className="max-w-6xl mx-auto pb-10">

            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b border-gray-800 pb-6">
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-mono flex items-center gap-1 mb-1">
                        <IconHome size={12} /> Grupo
                    </span>
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">{grupo.name}</h1>
                    <p className="text-sm text-gray-400 max-w-xl">{grupo.description || "Sin descripcion."}</p>
                </div>
                <div className="flex gap-3 self-end md:self-auto">
                    <button
                        onClick={() => setVerAjustes(true)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm border border-gray-700 transition-colors flex items-center gap-2"
                    >
                        <IconSettings size={16} /> Ajustes
                    </button>
                    {/* BOTÓN GLOBAL DE GASTO */}
                    <button
                        onClick={() => setModalGasto(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-black font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
                    >
                        <IconPlus size={16} /> Añadir Gasto
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                <div className="md:col-span-7 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold text-gray-200">Actividad Reciente</h2>
                    </div>

                    {gastos.length === 0 ? (
                        <p className="text-gray-500 text-xs italic font-mono p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                            No hay gastos registrados en este grupo todavia.
                        </p>
                    ) : (
                        gastos.map((gasto) => (
                            <div key={gasto.id} className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50 flex justify-between items-center border-l-4 border-l-green-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700 text-gray-400">
                                        <IconReceipt size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-200">{gasto.description}</h4>
                                        <p className="text-xs text-gray-500">Pagado por User ID: {gasto.paid_by}</p>
                                    </div>
                                </div>

                                <div className="text-right flex gap-6">
                                    <div className="min-w-[60px]">
                                        <p className="text-[10px] text-gray-500 font-mono">total</p>
                                        <p className="text-sm font-semibold text-gray-400">EUR {gasto.amount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="md:col-span-5 space-y-6">
                    <div className="bg-gray-800/90 rounded-2xl p-5 border border-gray-700/70 space-y-4">
                        <div>
                            <h3 className="text-base font-bold text-gray-200">Balances y Miembros</h3>
                            <p className="text-xs text-gray-500">Usuarios activos asignados a este grupo.</p>
                        </div>

                        <div className="space-y-3 pt-2">
                            {miembros.map((miembro, idx) => {
                                // Obtenemos el nombre y la foto del miembro según los datos que envíe tu backend
                                const nombreMostrar = miembro.username || miembro.first_name || `Usuario ${miembro.user_id}`;
                                const imagenPerfil = miembro.avatar_url || miembro.profile_pic;

                                return (
                                    <div key={idx} className="flex justify-between items-center text-sm bg-gray-900/40 p-2.5 rounded-xl border border-gray-800/40">
                                        <div className="flex items-center gap-3">
                                            {/* Renderizado de la imagen de perfil o avatar de reemplazo */}
                                            {imagenPerfil ? (
                                                <img
                                                    src={imagenPerfil}
                                                    alt={nombreMostrar}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-700"
                                                    onError={(e) => {
                                                        // Fallback en caso de que la URL de la imagen esté rota
                                                        e.target.onerror = null;
                                                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${nombreMostrar}`;
                                                    }}
                                                />
                                            ) : (
                                                // Si no hay foto, generamos un contenedor estético con la primera letra
                                                <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/30 text-xs font-bold uppercase font-mono">
                                                    {nombreMostrar.charAt(0)}
                                                </div>
                                            )}

                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-200">{nombreMostrar}</span>
                                                <span className="text-[10px] text-gray-500 font-mono">ID: {miembro.user_id}</span>
                                            </div>
                                        </div>

                                        <span className="text-xs font-mono bg-gray-950 px-2 py-1 rounded text-blue-400 capitalize">
                                            {miembro.role}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* BOTÓN GLOBAL DE LIQUIDAR */}
                        <button
                            onClick={() => setModalLiquidar(true)}
                            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
                        >
                            <IconDollar size={16} /> Liquidar
                        </button>
                    </div>

                    <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-800 space-y-3 text-xs">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span className="font-semibold text-gray-400">Info del Grupo</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Coste Total</span>
                            <span className="font-mono text-gray-300">EUR {totalExpensesSum.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Categoria</span>
                            <span className="text-gray-300 capitalize">{grupo.category || "General"}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal de Ajustes (Se mantiene local) */}
            <ModalAjustesGrupo
                estaAbierto={verAjustes}
                alCerrar={() => setVerAjustes(false)}
                grupoActual={grupo}
                alActualizar={(grupoActualizado) => {
                    setGrupo(grupoActualizado);
                }}
                alEliminar={() => {
                    router.push("/dashboard/groups");
                }}
            />
        </div>
    );
}