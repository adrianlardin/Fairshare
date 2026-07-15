"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModalCrearGrupo } from "@/components/ModalCrearGrupo";
import { IconArrowUp, IconArrowDown } from "@/components/icons";
import { useModales } from "../context/ModalContext";

const Dashboard = () => {
    const { modalGasto, setModalGasto, actualizarDatosTrigger } = useModales();
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [grupos, setGrupos] = useState([]);

    const [totalMeDeben, setTotalMeDeben] = useState(0.00);
    const [totalDebo, setTotalDebo] = useState(0.00);

    const [modalLiquidar, setModalLiquidar] = useState(false);
    const [modalGrupo, setModalGrupo] = useState(false);
   

    const [grupoSeleccionado, setGrupoSeleccionado] = useState({ id: null, nombre: "" });

    const [historial, setHistorial] = useState([]);
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "success" });
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        obtenerUsuario();
    }, []);

    useEffect(() => {
        obtenerDatosDashboard();
    }, [actualizarDatosTrigger]);


    const mostrarToast = (mensaje, tipo = "success") => {
        setToast({ mostrar: true, mensaje, tipo });
        setTimeout(() => setToast({ mostrar: false, mensaje: "", tipo: "success" }), 3000);
    };

    const obtenerUsuario = async () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const cached = JSON.parse(storedUser);
                setUsuario(cached);
            } catch (e) {}
        }

        try {
            const token = localStorage.getItem("token");
            if (!token || !storedUser) return;

            const userObj = JSON.parse(storedUser);
            const userId = userObj.id;
            if (!userId) return;

            const respuesta = await fetch(`http://localhost:5000/user/${userId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                setUsuario(datos);
                localStorage.setItem("user", JSON.stringify(datos));
            } else if (respuesta.status === 401) {
                localStorage.clear();
                router.push("/login");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerDatosDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            if (!token || !storedUser) return;

            const userObj = JSON.parse(storedUser);
            const miId = userObj.id;
            if (!miId) return;

            const resGrupos = await fetch("http://localhost:5000/groups", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (resGrupos.status === 401) {
                localStorage.clear();
                router.push("/login");
                return;
            }

            if (resGrupos.ok) {
                const datosBrutos = await resGrupos.json();
                const datosGrupos = Array.isArray(datosBrutos) ? datosBrutos : (datosBrutos.groups || []);
                
                let totalMeDebenTemp = 0;
                let totalDeboTemp = 0;
                let gruposConSaldos = [];
                

                for (let grupo of datosGrupos) {
                    let saldoDelGrupo = 0; 
                    let nombresMiembros = {};

                    try {
                        const resMiembros = await fetch(`http://localhost:5000/groups/${grupo.id}/members`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (resMiembros.ok) {
                            const miembros = await resMiembros.json();
                            miembros.forEach(m => {
                                nombresMiembros[m.user_id] = m.user.name || m.user.user_name;
                            });
                        }
                    } catch (e) {}

                   

                    try {
                        const resGastos = await fetch(`http://localhost:5000/groups/${grupo.id}/expenses`, {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${token}` }
                        });

                        if (resGastos.ok) {
                            const gastos = await resGastos.json();
                            gastos.forEach(gasto => {
                                if (gasto.paid_by === miId) {
                                    gasto.splits.forEach(split => {
                                        if (split.user_id !== miId) {
                                            saldoDelGrupo += split.amount;
                                            totalMeDebenTemp += split.amount;
                                            registrarAmigo(split.user_id, split.amount); 
                                        }
                                    });
                                } else {
                                    gasto.splits.forEach(split => {
                                        if (split.user_id === miId) {
                                            saldoDelGrupo -= split.amount;
                                            totalDeboTemp += split.amount;
                                            registrarAmigo(gasto.paid_by, -split.amount); 
                                        }
                                    });
                                }
                            });
                        }
                    } catch(e) {}

                    try {
                        const resPagos = await fetch(`http://localhost:5000/groups/${grupo.id}/settlements`, {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${token}` }
                        });

                        if (resPagos.ok) {
                            const pagos = await resPagos.json();
                            pagos.forEach(pago => {
                                if (pago.paid_by === miId) {
                                    saldoDelGrupo += pago.amount;
                                    totalDeboTemp -= pago.amount;
                                    registrarAmigo(pago.paid_to, pago.amount); 
                                } else if (pago.paid_to === miId) {
                                    saldoDelGrupo -= pago.amount;
                                    totalMeDebenTemp -= pago.amount;
                                    registrarAmigo(pago.paid_by, -pago.amount); 
                                }
                            });
                        }
                    } catch(e) {}

                    gruposConSaldos.push({
                        id: grupo.id,
                        name: grupo.name,
                        nombre: grupo.name,
                        categoria: grupo.category,
                        saldo: saldoDelGrupo
                    });
                }

                setGrupos(gruposConSaldos);
                setTotalMeDeben(Math.max(0, totalMeDebenTemp));
                setTotalDebo(Math.max(0, totalDeboTemp));
                
              
            }
        } catch (error) {
            console.error(error);
        }
    };

    const manejarSubmitLiquidar = async (e) => {
        e.preventDefault();
        const grupoId = e.target[0].value;
        const paidTo = parseInt(e.target[1].value.trim());
        const cantidad = parseFloat(e.target[2].value);

        if (!grupoId || !paidTo || isNaN(cantidad) || cantidad <= 0) {
            mostrarToast("Introduce un grupo, un ID valido y un monto mayor a 0", "error");
            return;
        }

        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:5000/groups/${grupoId}/settlements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    paid_to: paidTo,
                    amount: cantidad
                })
            });

            if (respuesta.ok) {
                mostrarToast("Pago registrado correctamente");
                e.target.reset();
                setModalLiquidar(false);
                await obtenerDatosDashboard();
            } else {
                const errorData = await respuesta.json();
                mostrarToast(errorData.error || "Error al registrar el pago", "error");
            }
        } catch (error) {
            mostrarToast("Error de conexion", "error");
        } finally {
            setCargando(false);
        }
    };

    const manejarSubmitGrupo = async (e) => {
        e.preventDefault();
        const nombreNuevoGrupo = e.target[0].value.trim();

        if (!nombreNuevoGrupo) {
            mostrarToast("El nombre del grupo no puede estar vacio", "error");
            return;
        }

        setCargando(true);
        try {
            const nuevoGrupo = {
                id: Date.now(),
                nombre: nombreNuevoGrupo,
                saldo: 0
            };

            setGrupos([...grupos, nuevoGrupo]);
            setHistorial([
                { id: Date.now(), texto: `Creaste el grupo "${nombreNuevoGrupo}"` },
                ...historial
            ]);
            mostrarToast("Grupo creado con exito");
            e.target.reset();
            setModalGrupo(false);
        } catch (error) {
            mostrarToast("Error al crear el grupo", "error");
        } finally {
            setCargando(false);
        }
    };



    

   

    const salirYBorrarGrupo = async (id, nombre) => {
        const confirmar = window.confirm(`Estas seguro de que quieres salir y borrar el grupo "${nombre}"?`);
        if (!confirmar) return;

        try {
            const token = localStorage.getItem("token");

            const respuesta = await fetch(`http://localhost:5000/groups/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                setGrupos(grupos.filter(grupo => grupo.id !== id));
                setHistorial([
                    { id: Date.now(), texto: `Eliminaste el grupo "${nombre}"` },
                    ...historial
                ]);
                mostrarToast("Grupo eliminado correctamente");
            } else {
                const errorData = await respuesta.json();
                mostrarToast(errorData.error || "Hubo un problema al eliminar el grupo", "error");
            }
        } catch (error) {
            mostrarToast("Error de conexion con el servidor", "error");
        }
    };

    

    const limpiarTodoHistorial = () => {
        setHistorial([]);
        mostrarToast("Historial vaciado");
    };

    const eliminarActividadIndividual = (id) => {
        setHistorial(historial.filter(act => act.id !== id));
        mostrarToast("Actividad eliminada");
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Panel de control</h1>
                    <h2 className="text-sm text-gray-400">
                        {usuario ? (
                            <Link href="/dashboard/profile" className="hover:text-blue-400 transition-colors cursor-pointer" title="Ir a mi perfil">
                                Hola, {usuario.name || usuario.user_name}
                            </Link>
                        ) : (
                            "Cargando..."
                        )}
                    </h2>
                </div>

                <div className="flex gap-3">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded-md transition-colors"
                        onClick={() => setModalGasto(true)}
                    >
                        Anadir un gasto
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-md transition-colors"
                        onClick={() => setModalLiquidar(true)}
                    >
                        Liquidar deudas
                    </button>
                </div>
            </div>

            <div className="mb-10">
                <h4 className="text-sm text-gray-400 mb-4">Vista general</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-green-500 border-y border-r border-y-gray-700 border-r-gray-700">
                        <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">ME DEBEN <span className="text-green-500"><IconArrowUp size={14} /></span></p>
                        <h2 className="text-green-500 text-3xl font-bold mb-2">{totalMeDeben.toFixed(2)} EUR</h2>
                        <p className="text-gray-400 text-xs">Saldos temporales</p>
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-blue-500 border-y border-r border-y-gray-700 border-r-gray-700">
                        <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">DEBO <span className="text-blue-400"><IconArrowDown size={14} /></span></p>
                        <h2 className="text-blue-400 text-3xl font-bold mb-2">{totalDebo.toFixed(2)} EUR</h2>
                        <p className="text-gray-400 text-xs">Saldos temporales</p>
                    </div>
                </div>
            </div>

            {historial.length > 0 && (
                <div className="mb-10 bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold text-gray-400">Actividad reciente</h4>
                        <button
                            onClick={limpiarTodoHistorial}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Limpiar todo
                        </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {historial.map((act) => (
                            <div key={act.id} className="text-sm flex justify-between items-center bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 gap-4">
                                <span className="text-gray-300 flex-1">{act.texto}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">{new Date(act.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <button
                                        onClick={() => eliminarActividadIndividual(act.id)}
                                        className="text-gray-500 hover:text-red-500 font-bold text-xs px-1 transition-colors bg-transparent border-none cursor-pointer"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                <div className="md:col-span-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold text-white">Grupos Activos</h4>
                        <button
                            className="border border-gray-500 text-gray-300 hover:text-white hover:border-white text-xs py-1 px-2 rounded-md transition-colors"
                            onClick={() => setModalGrupo(true)}
                        >
                            + Crear grupo
                        </button>
                    </div>

                    {grupos.length === 0 && (
                        <p className="text-gray-500 text-sm italic p-4 bg-gray-800 rounded-xl border border-gray-700">
                            Aun no hay grupos creados.
                        </p>
                    )}

                    {grupos.map((grupo) => (
                        <div key={grupo.id} className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold">{grupo.name}</span>
                                {grupo.saldo > 0 ? (
                                    <span className="text-green-500 text-xs m-0">Te deben {grupo.saldo} EUR</span>
                                ) : grupo.saldo < 0 ? (
                                    <span className="text-blue-400 text-xs m-0">Debes {Math.abs(grupo.saldo)} EUR</span>
                                ) : (
                                    <span className="text-gray-400 text-xs m-0">Saldado</span>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end">
                               
                                <button
                                    onClick={() => salirYBorrarGrupo(grupo.id, grupo.name)}
                                    className="text-xs border border-red-900 text-red-400 hover:bg-red-900 hover:text-white px-2 py-1 rounded transition-colors"
                                >
                                    Salir / Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-8">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold">Transacciones pendientes</h4>
                        
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="grid grid-cols-12 text-xs text-gray-400 mb-4 border-b border-gray-700 pb-2">
                            <div className="col-span-5">AMIGO</div>
                            <div className="col-span-3 text-center">GRUPO</div>
                            <div className="col-span-3 text-right">BALANCE</div>
                            <div className="col-span-1 text-right"></div>
                        </div>

                        

                       
                    </div>
                </div>
            </div>

            {modalLiquidar && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Liquidar deudas</h3>
                        <form onSubmit={manejarSubmitLiquidar}>
                            <label className="block text-xs text-gray-400 mb-1">De que grupo es la deuda?</label>
                            <select className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-green-500 cursor-pointer" required>
                                <option value="">Selecciona un grupo</option>
                                {grupos.map((grupo) => (
                                    <option key={grupo.id} value={grupo.id}>{grupo.name}</option>
                                ))}
                            </select>

                            <label className="block text-xs text-gray-400 mb-1">ID del usuario al que le pagas</label>
                            <input 
                                type="number" 
                                min="1" 
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                required 
                                placeholder="Ej. 3" 
                            />

                            <label className="block text-xs text-gray-400 mb-1">Cantidad a saldar (EUR)</label>
                            <input type="number" step="0.01" min="0.01" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-green-500" required placeholder="0.00" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalLiquidar(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" disabled={cargando} className="px-4 py-2 bg-green-500 text-black font-bold rounded-md hover:bg-green-600 transition-colors disabled:opacity-50">
                                    {cargando ? "Registrando..." : "Registrar pago"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ModalCrearGrupo 
                estaAbierto={modalGrupo}
                alCerrar={() => setModalGrupo(false)}
                onGrupoCreado={obtenerDatosDashboard}
            />

           

            

            {toast.mostrar && (
                <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${toast.tipo === "error" ? "bg-red-900 border-red-700 text-white" : "bg-green-900 border-green-700 text-white"}`}>
                    {toast.mensaje}
                </div>
            )}
        </div>
    );
};

export default Dashboard;