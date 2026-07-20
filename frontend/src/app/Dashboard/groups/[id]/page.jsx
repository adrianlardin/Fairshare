"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModalAjustesGrupo } from "@/components/ModalAjustesGrupo";
import { useModales } from "@/app/context/ModalContext";
import { IconHome, IconSettings, IconPlus, IconReceipt, IconDollar } from "@/components/icons";

export default function GroupDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const { setModalGasto, refrescoTrigger } = useModales();

    const [grupo, setGrupo] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [miId, setMiId] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    const [verAjustes, setVerAjustes] = useState(false);
    const [mostrarModalLiquidar, setMostrarModalLiquidar] = useState(false);
    const [cargandoAccion, setCargandoAccion] = useState(false);

    const cargarDatosGrupo = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            
            if (storedUser) {
                const userObj = JSON.parse(storedUser);
                setMiId(Number(userObj.id));
            }

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const [resGrupo, resMiembros, resGastos, resPagos] = await Promise.all([
                fetch(`http://localhost:5000/groups/${id}`, { headers }),
                fetch(`http://localhost:5000/groups/${id}/members`, { headers }),
                fetch(`http://localhost:5000/groups/${id}/expenses`, { headers }),
                fetch(`http://localhost:5000/groups/${id}/settlements`, { headers }).catch(() => ({ ok: false }))
            ]);

            if (resGrupo.ok && resMiembros.ok && resGastos.ok) {
                const dataGrupo = await resGrupo.json();
                const dataMiembros = await resMiembros.json();
                const dataGastos = await resGastos.json();
                const dataPagos = resPagos.ok ? await resPagos.json() : [];

                setGrupo(dataGrupo);
                setMiembros(dataMiembros);
                setGastos(dataGastos);
                setPagos(dataPagos);
            } else {
                console.error("Error al procesar la informacion del grupo.");
            }
        } catch (error) {
            console.error("Error de comunicacion con el backend:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (id) cargarDatosGrupo();
    }, [id, refrescoTrigger]);

    // Función auxiliar para traducir IDs a Nombres
    const obtenerNombreMiembro = (userId) => {
        const miembro = miembros.find(m => Number(m.user_id) === Number(userId));
        return miembro ? (miembro.username || miembro.first_name || `Usuario ${userId}`) : `Usuario ${userId}`;
    };

    // Función para salir del grupo
    const manejarSalirGrupo = async () => {
        const confirmar = window.confirm("¿Estás seguro de que quieres abandonar este grupo? Tus registros financieros se mantendrán para cuadrar las cuentas, pero dejarás de pertenecer a él.");
        if (!confirmar) return;

        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/groups/${id}/members/${miId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (respuesta.ok) {
                router.push("/dashboard/groups");
            } else {
                const errorData = await respuesta.json();
                alert(errorData.error || "No se pudo salir del grupo.");
                setCargando(false);
            }
        } catch (err) {
            alert("Error de conexión al intentar salir.");
            setCargando(false);
        }
    };

    // Función para el formulario de liquidar interno
    const manejarSubmitLiquidarLocal = async (e) => {
        e.preventDefault();
        const receptor = e.target[0].value;
        const cantidad = parseFloat(e.target[1].value);

        if (!receptor || isNaN(cantidad) || cantidad <= 0) return;

        setCargandoAccion(true);
        try {
            const token = localStorage.getItem("token");
            const bodyData = { amount: cantidad };
            
            // Si elige a un usuario en concreto, enviamos el paid_to. Si es al grupo, va nulo.
            if (receptor !== "group") {
                bodyData.paid_to = parseInt(receptor);
            }

            const respuesta = await fetch(`http://localhost:5000/groups/${id}/settlements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            if (respuesta.ok) {
                setMostrarModalLiquidar(false);
                cargarDatosGrupo(); // Recargamos para actualizar balances
            } else {
                const errorData = await respuesta.json();
                alert(errorData.error || "Error al registrar el pago.");
            }
        } catch (error) {
            alert("Error de conexión al registrar el pago.");
        } finally {
            setCargandoAccion(false);
        }
    };


    if (cargando) return <div className="text-white flex items-center justify-center font-mono text-xs py-10">Cargando...</div>;
    if (!grupo) return <div className="text-white flex items-center justify-center py-10">Grupo no encontrado.</div>;

    const totalExpensesSum = gastos.reduce((acc, current) => acc + parseFloat(current.amount || 0), 0);

    let miSaldoNeto = 0;
    if (miId) {
        gastos.forEach(gasto => {
            const pagadoPor = Number(gasto.paid_by);
            if (pagadoPor === miId) {
                gasto.splits?.forEach(split => {
                    if (Number(split.user_id) !== miId) miSaldoNeto += parseFloat(split.amount || 0);
                });
            } else {
                gasto.splits?.forEach(split => {
                    if (Number(split.user_id) === miId) miSaldoNeto -= parseFloat(split.amount || 0);
                });
            }
        });

        pagos.forEach(pago => {
            if (Number(pago.paid_by) === miId) miSaldoNeto += parseFloat(pago.amount || 0);
            if (Number(pago.paid_to) === miId) miSaldoNeto -= parseFloat(pago.amount || 0);
        });
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b border-gray-800 pb-6">
                
                <div className="flex gap-5 items-center w-full md:w-auto">
                    <div className="w-20 h-20 shrink-0 rounded-2xl border border-gray-700 bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg">
                        {grupo.image ? (
                            <img src={grupo.image} alt={grupo.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl">📷</span>
                        )}
                    </div>

                    <div className="flex-1">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono flex items-center gap-1 mb-1">
                            <IconHome size={12} /> {grupo.category || "Grupo"}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-100 mb-1">{grupo.name}</h1>
                        <p className="text-sm text-gray-400 max-w-xl line-clamp-2">{grupo.description || "Sin descripción."}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 self-end md:self-auto w-full md:w-auto justify-end mt-4 md:mt-0">
                    <button
                        onClick={manejarSalirGrupo}
                        className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-red-500/20 hover:border-red-500 transition-all flex items-center gap-2"
                        title="Abandonar este grupo"
                    >
                        Salir
                    </button>
                    <button
                        onClick={() => setVerAjustes(true)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-700 transition-colors flex items-center gap-2"
                    >
                        <IconSettings size={16} /> Ajustes
                    </button>
                    <button
                        onClick={() => setModalGasto(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-[#0b0f14] font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
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
                                        <p className="text-xs text-gray-500">
                                            Pagado por: <span className="text-gray-300">{obtenerNombreMiembro(gasto.paid_by)}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right flex gap-6">
                                    <div className="min-w-[60px]">
                                        <p className="text-[10px] text-gray-500 font-mono">total</p>
                                        <p className="text-sm font-semibold text-gray-400">EUR {parseFloat(gasto.amount || 0).toFixed(2)}</p>
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
                                const nombreMostrar = miembro.username || miembro.first_name || `Usuario ${miembro.user_id}`;
                                const imagenPerfil = miembro.avatar_url || miembro.profile_pic;

                                return (
                                    <div key={idx} className="flex justify-between items-center text-sm bg-gray-900/40 p-2.5 rounded-xl border border-gray-800/40">
                                        <div className="flex items-center gap-3">
                                            {imagenPerfil ? (
                                                <img
                                                    src={imagenPerfil}
                                                    alt={nombreMostrar}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-700"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${nombreMostrar}`;
                                                    }}
                                                />
                                            ) : (
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

                        <button
                            onClick={() => setMostrarModalLiquidar(true)}
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
                            <span className="text-gray-500">Coste Total del Grupo</span>
                            <span className="font-mono text-gray-300 font-bold">EUR {totalExpensesSum.toFixed(2)}</span>
                        </div>
                        {miId && (
                            <div className="flex justify-between border-t border-gray-800/60 pt-2">
                                <span className="text-gray-500">Tu Estado Neto</span>
                                <span className={`font-mono font-bold ${miSaldoNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {miSaldoNeto >= 0 ? `Te deben: EUR ${miSaldoNeto.toFixed(2)}` : `Debes: EUR ${Math.abs(miSaldoNeto).toFixed(2)}`}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Categoria</span>
                            <span className="text-gray-300 capitalize">{grupo.category || "General"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ModalAjustesGrupo
                estaAbierto={verAjustes}
                alCerrar={() => setVerAjustes(false)}
                grupoActual={grupo}
                alActualizar={(grupoActualizado) => setGrupo(grupoActualizado)}
                alEliminar={() => router.push("/dashboard/groups")}
            />

            {/* --- MODAL DE LIQUIDAR (ESTILO ORIGINAL RESTAURADO) --- */}
            {mostrarModalLiquidar && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Aportar o Pagar</h3>
                        <form onSubmit={manejarSubmitLiquidarLocal}>
                            
                            <label className="block text-xs text-gray-400 mb-1">¿A quién va dirigido el pago?</label>
                            <select 
                                required 
                                defaultValue=""
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-green-500 cursor-pointer"
                            >
                                <option value="" disabled>-- Selecciona un destinatario --</option>
                                <option value="group">Al bote general del grupo</option>
                                
                                <optgroup label="A un miembro específico">
                                    {miembros.filter(m => Number(m.user_id) !== miId).map((m) => (
                                        <option key={m.user_id} value={m.user_id}>
                                            {m.username || m.first_name || `Usuario ${m.user_id}`}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>

                            <label className="block text-xs text-gray-400 mb-1">Cantidad (EUR)</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0.01" 
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-green-500" 
                                required 
                                placeholder="0.00" 
                            />

                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarModalLiquidar(false)} 
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={cargandoAccion} 
                                    className="px-4 py-2 bg-green-500 text-black font-bold rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {cargandoAccion ? "Registrando..." : "Registrar pago"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}