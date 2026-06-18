"use client";

import React, { useState, useEffect } from "react";

const Dashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [grupos, setGrupos] = useState([]);
    const [amigos, setAmigos] = useState([]);

    const [totalMeDeben, setTotalMeDeben] = useState(0.00);
    const [totalDebo, setTotalDebo] = useState(0.00);

    const [modalGasto, setModalGasto] = useState(false);
    const [modalLiquidar, setModalLiquidar] = useState(false);
    const [modalGrupo, setModalGrupo] = useState(false);
    const [modalAmigo, setModalAmigo] = useState(false);

    const [modalAmigoGrupo, setModalAmigoGrupo] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState("");

    const obtenerUsuario = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            if (!token || !userId) return;

            const respuesta = await fetch(`http://localhost:5000/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                setUsuario(datos);
            }
        } catch (error) {
            console.log("Error al pedir el usuario:", error);
        }
    };

    const obtenerDatosDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const respuesta = await fetch("http://localhost:5000/groups", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();

                if (Array.isArray(datos)) {
                    setGrupos(datos);
                }
            }
        } catch (error) {
            console.log("Error de conexión con los grupos:", error);
        }
    };

    useEffect(() => {
        obtenerUsuario();
        obtenerDatosDashboard();
    }, []);

    const manejarSubmitGasto = (e) => {
        e.preventDefault();
        const cantidad = parseFloat(e.target[1].value);

        if (!isNaN(cantidad)) {
            setTotalMeDeben(totalMeDeben + cantidad);
        }

        e.target.reset();
        setModalGasto(false);
    };

    const manejarSubmitLiquidar = (e) => {
        e.preventDefault();
        const cantidad = parseFloat(e.target[1].value);

        if (!isNaN(cantidad)) {
            setTotalDebo(Math.max(0, totalDebo - cantidad));
        }

        e.target.reset();
        setModalLiquidar(false);
    };

    const manejarSubmitGrupo = (e) => {
        e.preventDefault();
        const nombreNuevoGrupo = e.target[0].value;

        const nuevoGrupo = {
            id: Date.now(),
            nombre: nombreNuevoGrupo,
            saldo: 0
        };

        setGrupos([...grupos, nuevoGrupo]);
        e.target.reset();
        setModalGrupo(false);
    };

    const manejarSubmitAmigo = (e) => {
        e.preventDefault();
        const nombreAmigo = e.target[0].value;

        const nuevoAmigo = {
            id: Date.now(),
            inicial: nombreAmigo.charAt(0).toUpperCase(),
            nombre: nombreAmigo,
            grupo: "Sin grupo",
            saldo: 0.00
        };

        setAmigos([...amigos, nuevoAmigo]);
        e.target.reset();
        setModalAmigo(false);
    };

    const manejarSubmitAmigoGrupo = (e) => {
        e.preventDefault();
        const nombreAmigo = e.target[0].value;

        const nuevoAmigo = {
            id: Date.now(),
            inicial: nombreAmigo.charAt(0).toUpperCase(),
            nombre: nombreAmigo,
            grupo: grupoSeleccionado,
            saldo: 0.00
        };

        setAmigos([...amigos, nuevoAmigo]);
        e.target.reset();
        setModalAmigoGrupo(false);
    };

    const abrirModalAmigoGrupo = (nombreGrupo) => {
        setGrupoSeleccionado(nombreGrupo);
        setModalAmigoGrupo(true);
    };

    const salirYBorrarGrupo = (id) => {
        const confirmar = window.confirm("¿Estás seguro de que quieres salir y borrar este grupo de tu vista?");
        if (confirmar) {
            const nuevosGrupos = grupos.filter(grupo => grupo.id !== id);
            setGrupos(nuevosGrupos);
        }
    };

    const eliminarAmigo = (id) => {
        const confirmar = window.confirm("¿Quieres eliminar a este amigo de tu lista?");
        if (confirmar) {
            const nuevosAmigos = amigos.filter(amigo => amigo.id !== id);
            setAmigos(nuevosAmigos);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen pb-10 text-white relative">
            <div className="max-w-5xl mx-auto pt-12 px-6">

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Panel de control</h1>
                        <h2 className="text-sm text-gray-400">
                            {usuario ? `Hola, ${usuario.name || usuario.user_name} 👋` : "Cargando..."}
                        </h2>
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-md transition-colors"
                            onClick={() => setModalGasto(true)}
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
                    <h4 className="text-sm text-gray-400 mb-4">Overview</h4>
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
                                    <span className="text-sm font-bold">🏠 {grupo.nombre}</span>
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
                                        onClick={() => abrirModalAmigoGrupo(grupo.nombre)}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
                                    >
                                        + Añadir amigo
                                    </button>
                                    <button
                                        onClick={() => salirYBorrarGrupo(grupo.id)}
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
                            <h4 className="text-sm font-semibold">Quién te debe</h4>
                            <button
                                className="border border-gray-500 text-gray-300 hover:text-white hover:border-white text-xs py-1 px-3 rounded-md transition-colors"
                                onClick={() => setModalAmigo(true)}
                            >
                                + Añadir amigo
                            </button>
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
                                        {amigo.nombre}
                                    </div>
                                    <div className="col-span-3 text-gray-400 text-center text-xs">{amigo.grupo}</div>
                                    <div className={`col-span-3 text-right font-medium ${amigo.saldo > 0 ? 'text-green-500' : amigo.saldo < 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        {amigo.saldo > 0 ? `Te debe ${amigo.saldo} €` : amigo.saldo < 0 ? `Debes ${Math.abs(amigo.saldo)} €` : `0.00 €`}
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button
                                            onClick={() => eliminarAmigo(amigo.id)}
                                            className="text-gray-500 hover:text-red-500 font-bold px-2 py-1 transition-colors"
                                            title="Eliminar amigo"
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
                            <label className="block text-xs text-gray-400 mb-1">Descripción</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-yellow-400" required placeholder="Ej. Cena del viernes" />

                            <label className="block text-xs text-gray-400 mb-1">Cantidad (€)</label>
                            <input type="number" step="0.01" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-yellow-400" required placeholder="0.00" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalGasto(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors">Guardar gasto</button>
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
                            <label className="block text-xs text-gray-400 mb-1">¿A quién le pagas?</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:border-green-500" required placeholder="Nombre del amigo" />

                            <label className="block text-xs text-gray-400 mb-1">Cantidad a saldar (€)</label>
                            <input type="number" step="0.01" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-green-500" required placeholder="0.00" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalLiquidar(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-green-500 text-black font-bold rounded-md hover:bg-green-600 transition-colors">Registrar pago</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalGrupo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Crear nuevo grupo</h3>
                        <form onSubmit={manejarSubmitGrupo}>
                            <label className="block text-xs text-gray-400 mb-1">Nombre del grupo</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-white" required placeholder="Ej. Viaje a Madrid" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalGrupo(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">Crear grupo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalAmigo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Añadir un amigo</h3>
                        <form onSubmit={manejarSubmitAmigo}>
                            <label className="block text-xs text-gray-400 mb-1">Nombre o correo electrónico</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-white" required placeholder="correo@ejemplo.com" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalAmigo(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">Enviar invitación</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalAmigoGrupo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-2">Añadir amigo a un grupo</h3>
                        <p className="text-gray-400 text-sm mb-4">Grupo seleccionado: <span className="text-white font-bold">{grupoSeleccionado}</span></p>
                        <form onSubmit={manejarSubmitAmigoGrupo}>
                            <label className="block text-xs text-gray-400 mb-1">Nombre o correo electrónico</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mb-6 text-white focus:outline-none focus:border-white" required placeholder="correo@ejemplo.com" />

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setModalAmigoGrupo(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">Añadir al grupo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;