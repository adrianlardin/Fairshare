"use client";

import React, { useState, useEffect } from "react";

export default function ForexWidget() {
  const [datosDivisas, setDatosDivisas] = useState([]);
  const [fecha, setFecha] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDivisas = async () => {
      try {
        const res = await fetch("/api/forex");
        if (res.ok) {
          const data = await res.json();
          setDatosDivisas(data.divisas || []);
          setFecha(data.fecha || "");
        }
      } catch (error) {
        console.error("Error al cargar divisas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDivisas();
  }, []);

  return (
    <div className="bg-[#0b0f14] border border-white/10 rounded-2xl p-5 shadow-xl mt-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>🔱</span> Tipos de Cambio en Tiempo Real
          </h2>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Valor oficial de divisas frente al Euro (1 EUR)
          </p>
        </div>
        {fecha && (
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
            Actualizado: {fecha}
          </span>
        )}
      </div>

      {cargando ? (
        <div className="py-8 text-center text-xs text-slate-500 font-mono animate-pulse">
          Cargando cotizaciones del mercado de divisas...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {datosDivisas.map((item) => (
            <div
              key={item.simbolo}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-lg">{item.flag}</span>
                <span className="font-bold text-slate-300 font-mono">{item.simbolo}</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 truncate">{item.nombre}</p>
                <p className="text-sm font-extrabold font-mono text-emerald-400 mt-0.5">
                  {item.valor < 10 ? item.valor.toFixed(4) : item.valor.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}