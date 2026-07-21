"use client";

import React, { useState, useEffect } from "react";

export default function TravelPage() {
    const [ofertas, setOfertas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState("");

    const cargarViajes = async () => {
        setCargando(true);
        try {
            const res = await fetch("/api/travel-offers");
            if (res.ok) {
                const data = await res.json();
                setOfertas(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error cargando viajes:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarViajes();
    }, []);

    const ofertasFiltradas = ofertas.filter(
        (item) =>
            item.destino.toLowerCase().includes(filtro.toLowerCase()) ||
            item.origen.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto pb-10 space-y-6">
            <div className="border-b border-gray-800 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">
                        API Live Data
                    </span>
                    <h1 className="text-3xl font-bold text-gray-100 mt-1">Precios de Viajes en Tiempo Real</h1>
                    <p className="text-sm text-gray-400">Precios actualizados de vuelos y estancias obtenidos directamente de la red global de viajes.</p>
                </div>

                <div className="w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Filtrar por código (ej: MAD, PAR)..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {cargando ? (
                <div className="flex items-center justify-center py-20 text-gray-400 font-mono text-sm">
                    Consultando API de vuelos y hoteles en tiempo real...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ofertasFiltradas.length === 0 ? (
                        <p className="text-gray-500 text-xs italic col-span-3">No se encontraron resultados para la búsqueda.</p>
                    ) : (
                        ofertasFiltradas.map((item) => (
                            <div
                                key={item.id}
                                className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden hover:border-slate-600 transition-all flex flex-col justify-between"
                            >
                                <div className="relative h-40 w-full overflow-hidden">
                                    <img src={item.imagen} alt={item.destino} className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-blue-400 font-bold border border-blue-500/30">
                                        {item.escala}
                                    </div>
                                </div>

                                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ruta: {item.origen} ➔ {item.destino}</p>
                                        <h3 className="text-lg font-bold text-slate-100">Destino: {item.destino}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Fecha estimada: {item.fechaSalida}</p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase font-mono block">Vuelo (API en vivo)</span>
                                            <span className="text-base font-bold font-mono text-emerald-400">€{item.precioVuelo}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-500 uppercase font-mono block">Hotel est. / noche</span>
                                            <span className="text-base font-bold font-mono text-blue-400">€{item.hotelNoche}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}