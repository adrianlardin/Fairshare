"use client";

import React, { useState, useEffect } from "react";
import { IconDollar, IconReceipt } from "@/components/icons"; // O usa los iconos que tengas a mano

export default function CryptoBlogPage() {
    const [tabActiva, setTabActiva] = useState("noticias"); // 'noticias' | 'mercado'
    const [criptos, setCriptos] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 1. Cargar precios de criptomonedas (CoinGecko API)
    const cargarPrecios = async () => {
        try {
            const res = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false"
            );
            if (res.ok) {
                const data = await res.json();
                setCriptos(data);
            }
        } catch (error) {
            console.error("Error cargando criptomonedas:", error);
        }
    };

    // 2. Cargar noticias sobre cripto/inversión (CryptoCompare API - CORS friendly)
    const cargarNoticias = async () => {
        try {
            const res = await fetch("/api/crypto-news");
            if (res.ok) {
                const data = await res.json();
                setNoticias(Array.isArray(data) ? data : []);
            } else {
                console.error("Respuesta no OK de la API interna de noticias");
            }
        } catch (error) {
            console.error("Error cargando noticias:", error);
        }
    };

    useEffect(() => {
        const cargarTodo = async () => {
            setCargando(true);
            await Promise.all([cargarPrecios(), cargarNoticias()]);
            setCargando(false);
        };
        cargarTodo();
    }, []);

    if (cargando) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 font-mono text-sm">
                Cargando datos del mercado de criptomonedas...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-10 space-y-6">
            {/* Cabecera */}
            <div className="border-b border-gray-800 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">
                        Finanzas & Inversión
                    </span>
                    <h1 className="text-3xl font-bold text-gray-100 mt-1">Blog & Criptomonedas</h1>
                    <p className="text-sm text-gray-400">Noticias del sector, análisis y cotizaciones en tiempo real.</p>
                </div>

                {/* Selector de pestañas */}
                <div className="flex bg-gray-800/80 p-1 rounded-xl border border-gray-700/60">
                    <button
                        onClick={() => setTabActiva("noticias")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tabActiva === "noticias"
                            ? "bg-blue-500 text-black shadow-md"
                            : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        📰 Noticias y Artículos
                    </button>
                    <button
                        onClick={() => setTabActiva("mercado")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tabActiva === "mercado"
                            ? "bg-blue-500 text-black shadow-md"
                            : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        📈 Mercado Live
                    </button>
                </div>
            </div>

            {/* SECCIÓN 1: BLOG / NOTICIAS */}
            {tabActiva === "noticias" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {noticias.length === 0 ? (
                        <p className="text-gray-500 text-xs italic col-span-2">No se pudieron cargar las noticias en este momento.</p>
                    ) : (
                        noticias.map((item, index) => (
                            <article
                                key={index}
                                className="bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 rounded-2xl p-5 transition-all flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
                                        <span className="text-blue-400 font-semibold">{item.src || "CryptoNews"}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-100 hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-3">
                                        {item.description || "Haz clic en el enlace para leer la noticia completa sobre inversiones y análisis de mercado."}
                                    </p>
                                </div>

                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold font-mono self-start"
                                >
                                    Leer artículo completo →
                                </a>
                            </article>
                        ))
                    )}
                </div>
            )}

            {/* SECCIÓN 2: MERCADO / PRECIOS */}
            {tabActiva === "mercado" && (
                <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-gray-900/40 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-gray-200">Top 10 Criptomonedas por Capitalización</h2>
                        <span className="text-[10px] text-gray-500 font-mono">Moneda: EUR</span>
                    </div>

                    <div className="divide-y divide-gray-800/80">
                        {criptos.map((coin) => {
                            const esPositivo = coin.price_change_percentage_24h >= 0;
                            return (
                                <div key={coin.id} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-gray-100">{coin.name}</span>
                                                <span className="text-[10px] text-gray-500 uppercase font-mono">{coin.symbol}</span>
                                            </div>
                                            <span className="text-[11px] text-gray-500 font-mono">
                                                Cap. de mercado: €{(coin.market_cap / 1000000000).toFixed(2)}B
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-bold font-mono text-gray-100">
                                            €{coin.current_price.toLocaleString("es-ES")}
                                        </p>
                                        <p className={`text-xs font-mono font-semibold ${esPositivo ? "text-green-400" : "text-red-400"}`}>
                                            {esPositivo ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}