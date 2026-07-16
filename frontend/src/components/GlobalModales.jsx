"use client";

import React, { useState, useEffect } from "react";
import { useModales } from "../app/context/ModalContext";
import { useParams } from "next/navigation"; // Para saber si estamos dentro de un grupo específico

export const GlobalModales = () => {
    // Extraemos el id de la URL si existe (ej: /dashboard/groups/3)
    const { id: grupoIdDesdeRuta } = useParams();

    // Añade "modalLiquidar" y "setModalLiquidar" a tu ModalContext si aún no los tienes.
    const {
        modalGasto,
        setModalGasto,
        modalLiquidar,
        setModalLiquidar,
        refrescarDatos
    } = useModales();

    const [grupos, setGrupos] = useState([]);
    const [miembros, setMiembros] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Estados para el formulario de Liquidar Deuda
    const [grupoSeleccionadoLiquidar, setGrupoSeleccionadoLiquidar] = useState("");
    const [destinatarioId, setDestinatarioId] = useState("");
    const [montoLiquidar, setMontoLiquidar] = useState("");

    // 1. Cargar grupos del usuario para los dropdowns
    useEffect(() => {
        if ((modalGasto || modalLiquidar) && grupos.length === 0) {
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
    }, [modalGasto, modalLiquidar, grupos.length]);

    // 2. Si estamos liquidando deudas, necesitamos saber los miembros del grupo seleccionado
    const grupoActivoParaLiquidar = grupoIdDesdeRuta || grupoSeleccionadoLiquidar;

    useEffect(() => {
        if (!modalLiquidar || !grupoActivoParaLiquidar) {
            setMiembros([]);
            return;
        }

        const obtenerMiembros = async () => {
            try {
                const token = localStorage.getItem("token");
                const respuesta = await fetch(`http://localhost:5000/groups/${grupoActivoParaLiquidar}/members`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setMiembros(datos);
                }
            } catch (error) {
                console.error("Error al obtener miembros:", error);
            }
        };
        obtenerMiembros();
    }, [modalLiquidar, grupoActivoParaLiquidar]);

    // SUBMIT: Crear Gasto
    const manejarSubmitGasto = async (e) => {
        e.preventDefault();
        // Si estamos en la vista de detalle, usamos 'grupoIdDesdeRuta', si no, el valor del select
        const grupoId = grupoIdDesdeRuta || e.target[0].value;
        const descripcion = (grupoIdDesdeRuta ? e.target[0].value : e.target[1].value).trim();
        const cantidad = parseFloat(grupoIdDesdeRuta ? e.target[1].value : e.target[2].value);

        if (!grupoId || !descripcion || isNaN(cantidad) || cantidad <= 0) {
            alert("Introduce datos válidos.");
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
                refrescarDatos(); // Llama a la función global para refrescar vistas
            } else {
                const errorData = await respuesta.json();
                alert(errorData.error || "Error al guardar el gasto");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        } finally {
            setCargando(false);
        }
    };

    // SUBMIT: Liquidar Deuda
    const manejarSubmitLiquidar = async (e) => {
        e.preventDefault();
        const grupoId = grupoIdDesdeRuta || grupoSeleccionadoLiquidar;

        if (!grupoId || !destinatarioId || !montoLiquidar) {
            alert("Completa todos los campos para registrar el pago.");
            return;
        }

        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/groups/${grupoId}/settle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    pay_to_id: parseInt(destinatarioId),
                    amount: parseFloat(montoLiquidar)
                })
            });

            if (respuesta.ok) {
                setModalLiquidar(false);
                setGrupoSeleccionadoLiquidar("");
                setDestinatarioId("");
                setMontoLiquidar("");
                refrescarDatos(); // Notifica a los componentes que los balances cambiaron
            } else {
                alert("Error al liquidar la deuda.");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            {/* ================= MODAL: AÑADIR GASTO ================= */}
            {modalGasto && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md text-white">
                        <h3 className="text-xl font-bold mb-4">Añadir un gasto</h3>
                        <form onSubmit={manejarSubmitGasto}>

                            {/* Ocultamos o deshabilitamos el select si ya estamos dentro de un grupo */}
                            {!grupoIdDesdeRuta ? (
                                <>
                                    <label className="block text-xs text-gray-400 mb-1">¿A qué grupo pertenece?</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                        required
                                    >
                                        <option value="">Selecciona un grupo</option>
                                        {grupos.map((g) => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <div className="mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700 text-xs text-gray-400">
                                    Registrando gasto directamente en este grupo activo.
                                </div>
                            )}

                            <label className="block text-xs text-gray-400 mb-1">Descripción</label>
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
            )}

            {/* ================= MODAL: LIQUIDAR DEUDA ================= */}
            {modalLiquidar && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md text-white">
                        <h3 className="text-xl font-bold mb-4">Liquidar una deuda</h3>
                        <form onSubmit={manejarSubmitLiquidar} className="space-y-4">

                            {!grupoIdDesdeRuta ? (
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Grupo</label>
                                    <select
                                        value={grupoSeleccionadoLiquidar}
                                        onChange={(e) => setGrupoSeleccionadoLiquidar(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none"
                                        required
                                    >
                                        <option value="">Selecciona un grupo</option>
                                        {grupos.map((g) => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 text-xs text-gray-400">
                                    Liquidando balances de este grupo.
                                </div>
                            )}

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Pagar a</label>
                                <select
                                    value={destinatarioId}
                                    onChange={(e) => setDestinatarioId(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none"
                                    required
                                >
                                    <option value="">Selecciona el miembro</option>
                                    {miembros.map((m) => (
                                        <option key={m.user_id} value={m.user_id}>
                                            User ID: {m.user_id} ({m.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Monto (EUR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={montoLiquidar}
                                    onChange={(e) => setMontoLiquidar(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalLiquidar(false)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={cargando}
                                    className="px-4 py-2 bg-green-500 text-black font-bold rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {cargando ? "Registrando..." : "Registrar Pago"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};