"use client";

import React, { useState, useEffect } from "react";
import { useModales } from "../app/context/ModalContext";

export const GlobalModales = () => {
    const { modalGasto, setModalGasto, refrescarDatos } = useModales();
    const [grupos, setGrupos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (modalGasto && grupos.length === 0) {
            const obtenerGrupos = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const respuesta = await fetch("http://localhost:5000/groups", {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (respuesta.ok) {
                        const datos = await respuesta.json();
                        setGrupos(datos);
                    }
                } catch (error) {
                    console.error("Error al obtener grupos:", error);
                }
            };
            obtenerGrupos();
        }
    }, [modalGasto]);

    const manejarSubmitGasto = async (e) => {
        e.preventDefault();
        const grupoId = e.target[0].value;
        const descripcion = e.target[1].value.trim();
        const cantidad = parseFloat(e.target[2].value);

        if (!grupoId || !descripcion || isNaN(cantidad) || cantidad <= 0) {
            alert("Selecciona un grupo, introduce una descripcion valida y un monto mayor a 0");
            return;
        }

        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/groups/${grupoId}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: descripcion,
                    amount: cantidad
                })
            });

            if (respuesta.ok) {
                e.target.reset();
                setModalGasto(false);
                refrescarDatos();
            } else {
                const errorData = await respuesta.json();
                alert(errorData.error || "Error al guardar el gasto en el servidor");
            }
        } catch (error) {
            console.error("Error de conexion:", error);
            alert("Error de conexion");
        } finally {
            setCargando(false);
        }
    };

    if (!modalGasto) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md text-white">
                <h3 className="text-xl font-bold mb-4">Anadir un gasto</h3>
                <form onSubmit={manejarSubmitGasto}>
                    <label className="block text-xs text-gray-400 mb-1">A que grupo pertenece?</label>
                    <select
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        required
                    >
                        <option value="">Selecciona un grupo</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.id} value={grupo.id}>{grupo.name}</option>
                        ))}
                    </select>

                    <label className="block text-xs text-gray-400 mb-1">Descripcion</label>
                    <input
                        type="text"
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-blue-500"
                        required
                        placeholder="Ej. Cena del viernes"
                    />

                    <label className="block text-xs text-gray-400 mb-1">Cantidad (EUR)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-blue-500"
                        required
                        placeholder="0.00"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setModalGasto(false)}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="px-4 py-2 bg-blue-500 text-black font-bold rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {cargando ? "Guardando..." : "Guardar gasto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};