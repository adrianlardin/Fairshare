import React, { useState } from "react";
import { useModales } from "../app/context/ModalContext";

export const ModalCrearGrupo = ({ estaAbierto, alCerrar, onGrupoCreado }) => {
  const { setActualizarDatosTrigger } = useModales();
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [categoria, setCategoria] = useState("Casa");
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState("");
  const [moneda, setMoneda] = useState("EUR (€)");
  
  const [emailAmigo, setEmailAmigo] = useState("");
  const [amigosAInvitar, setAmigosAInvitar] = useState([]);
  const [cargando, setCargando] = useState(false);

  if (!estaAbierto) return null;

  const agregarAmigoALista = () => {
    if (emailAmigo.trim() && emailAmigo.includes("@") && !amigosAInvitar.includes(emailAmigo.trim())) {
      setAmigosAInvitar([...amigosAInvitar, emailAmigo.trim()]);
      setEmailAmigo("");
    }
  };

  const quitarAmigoDeLista = (email) => {
    setAmigosAInvitar(amigosAInvitar.filter(e => e !== email));
  };

  const manejarCrearGrupo = async (e) => {
    e.preventDefault();
    if (!nombreGrupo.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Tu sesión ha caducado. Por favor, inicia sesión de nuevo.");
        return;
    }

    setCargando(true);
    const categoriaFinal = categoria === "Otro" ? categoriaPersonalizada : categoria;

    try {
      const response = await fetch("http://localhost:5000/groups", {
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
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.msg || "Error al crear el grupo");
      }

      const data = await response.json();
      const grupo = data.group || data;

      if (grupo && grupo.id && amigosAInvitar.length > 0) {
        for (let email of amigosAInvitar) {
          try {
            await fetch(`http://localhost:5000/groups/${grupo.id}/invite`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ email })
            });
          } catch (error) {
            console.error("Error al invitar amigo:", error);
          }
        }
      }

      setNombreGrupo("");
      setCategoria("Casa");
      setCategoriaPersonalizada("");
      setAmigosAInvitar([]);
      setEmailAmigo("");
      
      if (setActualizarDatosTrigger) setActualizarDatosTrigger(prev => prev + 1);
      if (onGrupoCreado) onGrupoCreado();
      
      alCerrar();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] px-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md flex flex-col overflow-hidden shadow-2xl max-h-[90vh]">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Crear nuevo grupo</h3>
          <button onClick={alCerrar} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto">
          <form onSubmit={manejarCrearGrupo} className="p-6 flex flex-col gap-6">
            
            {/* Recuadro de subir imagen y nombre del grupo */}
            <div className="flex gap-4">
              <div className="w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-gray-600 bg-gray-900 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 cursor-pointer transition-colors relative">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Subir</span>
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

            {/* Categorías */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Tipo de grupo</label>
              <div className="grid grid-cols-4 gap-2">
                {["Viaje", "Casa", "Pareja", "Otro"].map((cat) => (
                  <button 
                    key={cat} 
                    type="button" 
                    onClick={() => setCategoria(cat)} 
                    className={`py-2 rounded-md text-sm transition-all ${categoria === cat ? "bg-white text-black font-bold border border-white" : "bg-gray-900 text-gray-400 border border-gray-600 hover:text-white hover:border-gray-400"}`}
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

            {/* Selector de Moneda */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Moneda de liquidación</label>
              <select 
                value={moneda} 
                onChange={(e) => setMoneda(e.target.value)} 
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-all cursor-pointer appearance-none"
              >
                <option value="EUR (€)">EUR - Euro (€)</option>
                <option value="USD ($)">USD - Dólar Estadounidense ($)</option>
                <option value="GBP (£)">GBP - Libra Esterlina (£)</option>
              </select>
            </div>

            {/* Invitar Amigos */}
            <div className="border-t border-gray-700 pt-4">
              <label className="text-xs text-gray-400 mb-2 block">Invitar amigos (Opcional)</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="email" 
                  value={emailAmigo} 
                  onChange={(e) => setEmailAmigo(e.target.value)} 
                  placeholder="amigo@correo.com" 
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-all text-sm placeholder-gray-500" 
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarAmigoALista())}
                />
                <button 
                  type="button" 
                  onClick={agregarAmigoALista} 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Añadir
                </button>
              </div>
              
              {amigosAInvitar.length > 0 && (
                <div className="flex flex-col gap-2 max-h-24 overflow-y-auto pr-1">
                  {amigosAInvitar.map((email) => (
                    <div key={email} className="flex justify-between items-center bg-gray-900 px-3 py-2 rounded-md border border-gray-700">
                      <span className="text-sm text-gray-300 truncate">{email}</span>
                      <button 
                        type="button" 
                        onClick={() => quitarAmigoDeLista(email)} 
                        className="text-gray-500 hover:text-red-400 font-bold text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones finales */}
            <div className="flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={alCerrar} 
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={cargando} 
                className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {cargando ? "Creando..." : "Crear grupo"}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};