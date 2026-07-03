"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/navbar";
import Link from "next/link";
import { ModalCrearGrupo } from "../../components/ModalCrearGrupo";
import Sidebar from "../../components/sidebar";
import { useModales } from "../context/ModalContext";

const Dashboard = () => {
    const { modalGasto, setModalGasto, actualizarDatosTrigger } = useModales();

    const [usuario, setUsuario] = useState(null);
    const [grupos, setGrupos] = useState([]);
    const [amigos, setAmigos] = useState([]);
    const [amigosReales, setAmigosReales] = useState([]);

    const [totalMeDeben, setTotalMeDeben] = useState(0.00);
    const [totalDebo, setTotalDebo] = useState(0.00);

    const [modalLiquidar, setModalLiquidar] = useState(false);
    const [modalGrupo, setModalGrupo] = useState(false);
    const [modalAmigo, setModalAmigo] = useState(false);
    const [modalAmigoGrupo, setModalAmigoGrupo] = useState(false);

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
        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch("http://localhost:5000/friends", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (respuesta.ok) {
                const datosBrutos = await respuesta.json();
                const listaAmigos = Array.isArray(datosBrutos) ? datosBrutos : (datosBrutos.friends || datosBrutos.amigos || []);
                setAmigosReales(listaAmigos);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerDatosDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            let miId = null;

            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    miId = parseInt(parsedUser.id || parsedUser.user_id); 
                } catch (e) {
                    console.error(e);
                }
            }

            if (!miId || isNaN(miId)) {
                miId = parseInt(localStorage.getItem("user_id") || localStorage.getItem("id"));
            }
            
            if (!token || !miId || isNaN(miId)) return;

            const resGrupos = await fetch("http://localhost:5000/groups", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (resGrupos.ok) {
                const datosBrutos = await resGrupos.json();
                const datosGrupos = Array.isArray(datosBrutos) ? datosBrutos : (datosBrutos.groups || []);
                
                let totalMeDebenTemp = 0;
                let totalDeboTemp = 0;
                let gruposConSaldos = [];
                let listaAmigosTemp = {}; 

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

                    const registrarAmigo = (amigoId, cantidad) => {
                        const clave = `${grupo.id}-${amigoId}`; 
                        if (!listaAmigosTemp[clave]) {
                            const nombreReal = nombresMiembros[amigoId] || `Usuario #${amigoId}`;
                            listaAmigosTemp[clave] = {
                                id: clave,
                                usuario: nombreReal,
                                inicial: nombreReal.charAt(0).toUpperCase(),
                                grupo: grupo.name,
                                saldo: 0
                            };
                        }
                        listaAmigosTemp[clave].saldo += cantidad;
                    };

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
                
                const arrayAmigos = Object.values(listaAmigosTemp).filter(amigo => Math.abs(amigo.saldo) > 0.01);
                setAmigos(arrayAmigos);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const manejarSubmitGasto = async (e) => {
        e.preventDefault();
        const grupoId = e.target[0].value;
        const descripcion = e.target[1].value.trim();
        const cantidad = parseFloat(e.target[2].value);

        if (!grupoId || !descripcion || isNaN(cantidad) || cantidad <= 0) {
            mostrarToast("Introduce un grupo, una descripción válida y un monto mayor a 0", "error");
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
                mostrarToast("Gasto guardado correctamente");
                e.target.reset();
                if (setModalGasto) setModalGasto(false);
                await obtenerDatosDashboard(); 
            } else {
                const errorData = await respuesta.json();
                mostrarToast(errorData.error || "Error al guardar el gasto", "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            setCargando(false);
        }
    };

    const manejarSubmitLiquidar = async (e) => {
        e.preventDefault();
        const grupoId = e.target[0].value;
        const paidTo = parseInt(e.target[1].value.trim());
        const cantidad = parseFloat(e.target[2].value);

        if (!grupoId || !paidTo || isNaN(cantidad) || cantidad <= 0) {
            mostrarToast("Introduce un grupo, un ID válido y un monto mayor a 0", "error");
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
            mostrarToast("Error de conexión", "error");
        } finally {
            setCargando(false);
        }
    };

    const manejarSubmitGrupo = async (e) => {
        e.preventDefault();
        const nombreNuevoGrupo = e.target[0].value.trim();

        if (!nombreNuevoGrupo) {
            mostrarToast("El nombre del grupo no puede estar vacío", "error");
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
            mostrarToast("Grupo creado con éxito");
            e.target.reset();
            setModalGrupo(false);
        } catch (error) {
            mostrarToast("Error al crear el grupo", "error");
        } finally {
            setCargando(false);
        }
    };

    const manejarSubmitAmigo = async (e) => {
        e.preventDefault();
        const inputAmigo = e.target[0].value.trim();

        if (!inputAmigo) {
            mostrarToast("Debes ingresar un ID o Correo", "error");
            return;
        }

        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            
            const esCorreo = inputAmigo.includes("@");
            const bodyData = esCorreo ? { email: inputAmigo } : { friend_id: parseInt(inputAmigo) };

            const respuesta = await fetch("http://localhost:5000/friends/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            if (respuesta.ok) {
                mostrarToast("Solicitud de amistad procesada con éxito");
                e.target.reset();
                setModalAmigo(false);
                await obtenerAmigosReales();
            } else {
                const errorData = await respuesta.json();
                mostrarToast(errorData.error || "Error al enviar solicitud", "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            setCargando(false);
        }
    };

    const manejarSubmitAmigoGrupo = async (e) => {
        e.preventDefault();
        const emailInput = e.target[0].value.trim();

        if (!emailInput) {
            mostrarToast("El correo no puede estar vacío", "error");
            return;
        }

        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            
            const respuesta = await fetch(`http://localhost:5000/group/${grupoSeleccionado.id}/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: emailInput
                })
            });

            if (respuesta.ok) {
                mostrarToast("¡Invitación enviada por correo electrónico!");
                e.target.reset();
                setModalAmigoGrupo(false);
            } else {
                const errorData = await respuesta.json();
                mostrarToast(errorData.error || "Error al enviar la invitación", "error");
            }
        } catch (error) {
            mostrarToast("Error de conexión", "error");
        } finally {
            setCargando(false);
        }
    };

    const abrirModalAmigoGrupo = (id, nombre) => {
        setGrupoSeleccionado({ id, nombre });
        setModalAmigoGrupo(true);
    };

    const salirYBorrarGrupo = async (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que quieres salir y borrar el grupo "${nombre}"?`);
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
            mostrarToast("Error de conexión", "error");
        }
    };

    const eliminarAmigo = (id, usuario) => {
        const confirmar = window.confirm(`¿Quieres eliminar a ${usuario} de tu lista?`);
        if (confirmar) {
            setAmigos(amigos.filter(amigo => amigo.id !== id));
            setHistorial([
                { id: Date.now(), texto: `Eliminaste a ${usuario} de tus amigos` },
                ...historial
            ]);
            mostrarToast("Amigo eliminado");
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
        <div className="bg-gray-900 min-h-screen pb-10 text-white relative">
            <Navbar />
            <Sidebar />
            <div className="max-w-5xl mx-auto pt-24 px-6 md:pl-64">

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-sm text-gray-400 mb-1">Panel de control</h2>
                        <h1 className="text-2xl font-bold">
                            {usuario ? `¡Bienvenido, ${usuario.name || usuario.user_name}!` : "¡Bienvenido!"}
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-md transition-colors"
                            onClick={() => { if (setModalGasto) setModalGasto(true); }}
                        >
                            Añadir un gasto
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
                            <p className="text-gray-400 text-xs mb-2">ME DEBEN <span className="text-green-500">↑</span></p>
                            <h2 className="text-green-500 text-3xl font-bold mb-2">{totalMeDeben.toFixed(2)} €</h2>
                            <p className="text-gray-400 text-xs">Saldos temporales</p>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-yellow-400 border-y border-r border-y-gray-700 border-r-gray-700">
                            <p className="text-gray-400 text-xs mb-2">DEBO <span className="text-yellow-400">↓</span></p>
                            <h2 className="text-yellow-400 text-3xl font-bold mb-2">{totalDebo.toFixed(2)} €</h2>
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
                                Aún no hay grupos creados.
                            </p>
                        )}

                        {grupos.map((grupo) => (
                            <div key={grupo.id} className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold">{grupo.name}</span>
                                    {grupo.saldo > 0 ? (
                                        <span className="text-green-500 text-xs m-0">Te deben {grupo.saldo} €</span>
                                    ) : grupo.saldo < 0 ? (
                                        <span className="text-yellow-400 text-xs m-0">Debes {Math.abs(grupo.saldo)} €</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs m-0">Saldado</span>
                                    )}
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => abrirModalAmigoGrupo(grupo.id, grupo.nombre)}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
                                    >
                                        + Añadir amigo
                                    </button>
                                    <button
                                        onClick={() => salirYBorrarGrupo(grupo.id, grupo.name)}
                                        className="text-xs border border-red-900 text-red-400 hover:bg-red-900 hover:text-white px-2 py-1 rounded transition-colors"
                                    >
                                        Salir / Borrar
                                    </button>
                                </div>
                            </div>
                        ))}

                    <div className="md:col-span-8">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold">Transacciones pendientes</h4>
                            <button
                                className="border border-gray-500 text-gray-300 hover:text-white hover:border-white text-xs py-1 px-2 rounded-md transition-colors"
                                onClick={() => setModalAmigo(true)}
                            >
                                + Añadir amigo
                            </button>
                        </div>

                        {amigosReales.length === 0 && (
                            <p className="text-gray-500 text-sm italic p-4 bg-gray-800 rounded-xl border border-gray-700">
                                Aún no has añadido amigos.
                            </p>
                        )}

                        <div className="space-y-3">
                            {amigosReales.map((amistad) => (
                                <div key={amistad.friendship_id} className="bg-gray-800 rounded-xl p-3 border border-gray-700 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs text-white">
                                        {(amistad.user.name || amistad.user.user_name || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{amistad.user.name || amistad.user.user_name}</span>
                                        <span className="text-xs text-gray-400">{amistad.user.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-8">
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold">Transacciones pendientes</h4>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <div className="grid grid-cols-12 text-xs text-gray-400 mb-4 border-b border-gray-700 pb-2">
                                <div className="col-span-5">AMIGO</div>
                                <div className="col-span-3 text-center">GRUPO</div>
                                <div className="col-span-3 text-right">BALANCE</div>
                                <div className="col-span-1 text-right"></div>
                            </div>

                            {amigos.length === 0 && (
                                <p className="text-gray-500 text-sm text-center italic mt-6">
                                    No hay deudas registradas con amigos.
                                </p>
                            )}

                            {amigos.map((amigo) => (
                                <div key={amigo.id} className="grid grid-cols-12 items-center text-sm mb-4 last:mb-0">
                                    <div className="col-span-5 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                                            {amigo.inicial}
                                        </div>
                                        {amigo.usuario}
                                    </div>
                                    <div className="col-span-3 text-gray-400 text-center text-xs">{amigo.grupo}</div>
                                    <div className={`col-span-3 text-right font-medium ${amigo.saldo > 0 ? 'text-green-500' : amigo.saldo < 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        {amigo.saldo > 0 ? `Te debe ${amigo.saldo} €` : amigo.saldo < 0 ? `Debes ${Math.abs(amigo.saldo)} €` : `0.00 €`}
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button
                                            onClick={() => eliminarAmigo(amigo.id, amigo.usuario)}
                                            className="text-gray-500 hover:text-red-500 font-bold px-2 py-1 transition-colors"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>




           {modalGasto && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Añadir un gasto</h3>
                        <form onSubmit={manejarSubmitGasto}>
                            <label className="block text-xs text-gray-400 mb-1">¿A qué grupo pertenece?</label>
                            <select className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-yellow-400 cursor-pointer" required>
                                <option value="">Selecciona un grupo</option>
                                {grupos.map((grupo) => (
                                    <option key={grupo.id} value={grupo.id}>{grupo.name}</option>
                                ))}
                            </select>

                            <label className="block text-xs text-gray-400 mb-1">Descripción</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-yellow-400" required placeholder="Ej. Cena del viernes" />

                            <label className="block text-xs text-gray-400 mb-1">Cantidad (€)</label>
                            <input type="number" step="0.01" min="0.01" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-yellow-400" required placeholder="0.00" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => { if (setModalGasto) setModalGasto(false); }} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" disabled={cargando} className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50">
                                    {cargando ? "Guardando..." : "Guardar gasto"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalLiquidar && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Liquidar deudas</h3>
                        <form onSubmit={manejarSubmitLiquidar}>
                            <label className="block text-xs text-gray-400 mb-1">¿De qué grupo es la deuda?</label>
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

                            <label className="block text-xs text-gray-400 mb-1">Cantidad a saldar (€)</label>
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

            {modalAmigo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Enviar solicitud de amistad</h3>
                        <form onSubmit={manejarSubmitAmigo}>
                            <label className="block text-xs text-gray-400 mb-1">ID o Correo del Usuario</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-white"
                                required
                                placeholder="Ej. 5 o amigo@correo.com"
                            />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalAmigo(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" disabled={cargando} className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
                                    {cargando ? "Enviando..." : "Enviar solicitud"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalAmigoGrupo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-2">Invitar al grupo</h3>
                        <p className="text-gray-400 text-sm mb-4">Grupo seleccionado: <span className="text-white font-bold">{grupoSeleccionado.nombre}</span></p>

                        <form onSubmit={manejarSubmitAmigoGrupo}>
                            <label className="block text-xs text-gray-400 mb-1">Correo electrónico del usuario</label>
                            <input
                                type="email"
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-white"
                                required
                                placeholder="ejemplo@correo.com"
                            />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalAmigoGrupo(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" disabled={cargando} className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
                                    {cargando ? "Enviando correo..." : "Enviar invitación"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast.mostrar && (
                <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${toast.tipo === "error" ? "bg-red-900 border-red-700 text-white" : "bg-green-900 border-green-700 text-white"}`}>
                    {toast.mensaje}
                </div>
            )}
        </div>
    );
};

export default Dashboard;