import React, { useState } from "react";

export const ModalCrearGrupo = ({ estaAbierto, alCerrar, onGrupoCreado }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [categoria, setCategoria] = useState("Casa");
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState("");
  const [moneda, setMoneda] = useState("EUR (€)");
  const [buscarAmigo, setBuscarAmigo] = useState("");
  
  const [miembros, setMiembros] = useState([
    { id: "yo", nombre: "Tú", email: "tu@email.com", esCreador: true }
  ]);

  if (!estaAbierto) return null;

  const manejarCrearGrupo = async (e) => {
    e.preventDefault();

    if (!nombreGrupo.trim()) {
      alert("Por favor, ingresa un nombre para el grupo.");
      return;
    }

    if (categoria === "Otro" && !categoriaPersonalizada.trim()) {
      alert("Por favor, ingresa una categoría personalizada.");
      return;
    }

    const categoriaFinal = categoria === "Otro" ? categoriaPersonalizada.trim() : categoria;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nombreGrupo,
          category: categoriaFinal,
          description: "Grupo creado desde el panel de control"
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Hubo un problema al crear el grupo");
      }

      setNombreGrupo("");
      setCategoria("Casa");
      setCategoriaPersonalizada("");

      if (typeof onGrupoCreado === 'function') {
        onGrupoCreado();
      }

      window.location.reload();
      alCerrar();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] px-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Crear nuevo grupo</h3>
          <button onClick={alCerrar} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={manejarCrearGrupo} className="p-6 pt-4 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-600 bg-gray-900 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors relative">
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Subir</span>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1 text-black">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <label className="text-xs text-gray-400 mb-1 block">Nombre del grupo *</label>
              <input
                type="text"
                required
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                placeholder="Ej. Viaje a Madrid"
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-all placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Tipo de grupo</label>
            <div className="grid grid-cols-4 gap-2">
              {["Viaje", "Casa", "Pareja", "Otro"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className={`py-2 rounded-md text-sm transition-all ${
                    categoria === cat
                      ? "bg-white text-black font-bold border border-white"
                      : "bg-gray-900 text-gray-400 font-medium border border-gray-600 hover:text-white hover:border-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {categoria === "Otro" && (
              <input
                type="text"
                value={categoriaPersonalizada}
                onChange={(e) => setCategoriaPersonalizada(e.target.value)}
                placeholder="Escribe la categoría..."
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mt-3 text-white focus:outline-none focus:border-white transition-all placeholder-gray-500"
                required
              />
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Moneda de liquidación</label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white appearance-none transition-all cursor-pointer"
            >
              <option value="EUR (€)">EUR - Euro (€)</option>
              <option value="USD ($)">USD - Dólar Estadounidense ($)</option>
              <option value="GBP (£)">GBP - Libra Esterlina (£)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="text-xs text-gray-400">Miembros del grupo</label>
              <span className="text-xs text-yellow-400 font-bold">{miembros.length} MIEMBROS</span>
            </div>
            
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </span>
              <input
                type="text"
                value={buscarAmigo}
                onChange={(e) => setBuscarAmigo(e.target.value)}
                placeholder="Buscar amigos por usuario o email..."
                className="w-full bg-gray-900 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-white transition-all text-sm placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
              {miembros.map((miembro) => (
                <div key={miembro.id} className="flex justify-between items-center bg-gray-900 p-2 rounded-md border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-xs text-white">
                      {miembro?.nombre ? miembro.nombre.charAt(0) : "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{miembro.usuario}</span>
                      <span className="text-xs text-gray-400">{miembro.email}</span>
                    </div>
                  </div>
                  {miembro.esCreador ? (
                    <span className="text-[10px] bg-gray-700 px-2 py-1 rounded text-gray-300 font-bold tracking-wider">CREADOR</span>
                  ) : (
                    <button type="button" className="text-gray-500 hover:text-red-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2 border-t border-gray-700 pt-5">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Crear grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};