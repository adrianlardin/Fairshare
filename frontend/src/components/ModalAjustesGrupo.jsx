"use client";

import React, { useState, useEffect } from "react";
import { IconSettings, IconX } from "./icons";

export function ModalAjustesGrupo({ estaAbierto, alCerrar, grupoActual, alActualizar, alEliminar }) {
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (grupoActual) {
            setNuevoNombre(grupoActual.name);
            setError("");
        }
    }, [grupoActual, estaAbierto]);

    if (!estaAbierto || !grupoActual) return null;

    const manejarGuardarNombre = async (e) => {
        e.preventDefault();
        if (!nuevoNombre.trim()) return setError("El nombre no puede estar vacío");

        setCargando(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/group/${grupoActual.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: nuevoNombre })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                alActualizar(datos);
                alCerrar();
            } else {
                setError(datos.error || "No tienes permiso para editar este grupo.");
            }
        } catch (err) {
            setError("Error de conexión con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    const manejarEliminarGrupo = async () => {
        const confirmar = window.confirm(`¿Estás completamente seguro de eliminar el grupo "${grupoActual.name}"? Esta acción no se puede deshacer y borrará todos los gastos asociados.`);
        if (!confirmar) return;

        setCargando(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/group/${grupoActual.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                alEliminar();
            } else {
                const datos = await respuesta.json();
                setError(datos.error || "No tienes permiso para eliminar este grupo.");
            }
        } catch (err) {
            setError("Error de conexión al intentar eliminar.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl space-y-6">

                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        <IconSettings size={18} /> Ajustes de "{grupoActual.name}"
                    </h3>
                    <button onClick={alCerrar} className="text-gray-500 hover:text-white transition-colors"><IconX size={18} /></button>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl font-mono">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={manejarGuardarNombre} className="space-y-3">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase block">Cambiar nombre del grupo</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            disabled={cargando}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Nuevo nombre del grupo"
                        />
                        <button
                            type="submit"
                            disabled={cargando}
                            className="bg-blue-500 hover:bg-blue-600 text-black font-bold px-4 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50"
                        >
                            {cargando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>

                <hr className="border-slate-700" />

                <div className="space-y-3 bg-red-950/20 border border-red-900/30 p-4 rounded-xl">
                    <div>
                        <h4 className="text-sm font-bold text-red-400">Zona de Peligro</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Si eliminas este grupo, se perderán todos los balances y registros de forma permanente.</p>
                    </div>
                    <button
                        type="button"
                        onClick={manejarEliminarGrupo}
                        disabled={cargando}
                        className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 border border-red-500/20 hover:border-red-500 font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-50"
                    >
                        🗑️ Eliminar Grupo permanentemente
                    </button>
                </div>

            </div>
        </div>
    );
}