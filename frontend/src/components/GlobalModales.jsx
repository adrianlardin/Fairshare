"use client";

import React from "react";
import { useModales } from "../app/context/ModalContext";

export const GlobalModales = () => {
    const { modalGasto, setModalGasto, refrescarDatos } = useModales();

    const manejarSubmitGasto = async (e) => {
        e.preventDefault();
        const descripcion = e.target[0].value.trim();
        const cantidad = parseFloat(e.target[1].value);

        if (!descripcion || isNaN(cantidad) || cantidad <= 0) {
            alert("Introduce una descripción válida y un monto mayor a 0");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch("http://localhost:5000/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ descripcion, cantidad })
            });

            if (respuesta.ok) {
                e.target.reset();
                setModalGasto(false);
                refrescarDatos();
            } else {
                alert("Error al guardar el gasto en el servidor");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    if (!modalGasto) return null;

    return (
        <>
            {modalGasto && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md text-white">
                        <h3 className="text-xl font-bold mb-4">Añadir un gasto</h3>
                        <form onSubmit={manejarSubmitGasto}>
                            <label className="block text-xs text-gray-400 mb-1">Descripción</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-yellow-400"
                                required
                                placeholder="Ej. Cena del viernes"
                            />

                            <label className="block text-xs text-gray-400 mb-1">Cantidad (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-yellow-400"
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
                                    className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors"
                                >
                                    Guardar gasto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};