"use client";

import React, { useState, useEffect } from "react";

const Dashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [grupos, setGrupos] = useState([]);
    const [amigos, setAmigos] = useState([]);

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
                console.log("Respuesta del backend:", datos);
                
                if (Array.isArray(datos)) {
                    setGrupos(datos);
                } else {
                    console.log("El backend aún no está enviando la lista de grupos reales");
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

    const funcionAñadirGasto = () => alert("Falta crear el componente para añadir gasto");
    const funcionLiquidarDeudas = () => alert("Falta crear el componente para liquidar");
    const funcionAñadirAmigo = () => alert("Falta crear el componente para añadir amigo");
    const funcionCrearGrupo = () => alert("Falta crear el componente para crear un grupo");

    return (
        <div className="bg-gray-900 min-h-screen pb-10 text-white">
            <div className="max-w-5xl mx-auto pt-12 px-6">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Panel de control</h1>
                        <h2 className="text-sm text-gray-400">
                            {usuario ? `Hola, ${usuario.name || usuario.user_name} 👋` : "Usuario"}
                        </h2>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-md transition-colors"
                            onClick={funcionAñadirGasto}
                        >
                            Añadir un gasto
                        </button>
                        <button 
                            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-md transition-colors"
                            onClick={funcionLiquidarDeudas}
                        >
                            Pagar deudas
                        </button>
                    </div>
                </div>

                <div className="mb-10">
                    <h4 className="text-sm text-gray-400 mb-4">Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-green-500 border-y border-r border-y-gray-700 border-r-gray-700">
                            <p className="text-gray-400 text-xs mb-2">ME DEBEN <span className="text-green-500">↑</span></p>
                            <h2 className="text-green-500 text-3xl font-bold mb-2">0.00 €</h2>
                            <p className="text-gray-400 text-xs">Esperando datos...</p>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-yellow-400 border-y border-r border-y-gray-700 border-r-gray-700">
                            <p className="text-gray-400 text-xs mb-2">DEBO <span className="text-yellow-400">↓</span></p>
                            <h2 className="text-yellow-400 text-3xl font-bold mb-2">0.00 €</h2>
                            <p className="text-gray-400 text-xs">Esperando datos...</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    <div className="md:col-span-4">
                        <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold mb-4">Grupos Activos</h4>
                        <button 
                                className="border border-gray-500 text-gray-300 hover:text-white hover:border-white text-xs py-1 px-2 rounded-md transition-colors" 
                                onClick={funcionCrearGrupo}
                            >
                                + Crear grupo
                            </button>
                        </div> 
                        {grupos.length === 0 && (
                            <p className="text-gray-500 text-sm italic p-4 bg-gray-800 rounded-xl border border-gray-700">
                                No hay grupos creados.
                            </p>
                        )}

                        {grupos.map((grupo) => (
                            <div key={grupo.id} className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700 flex justify-between items-center">
                                <span className="text-sm">🏠 {grupo.nombre}</span>
                                {grupo.saldo > 0 ? (
                                    <p className="text-green-500 text-xs m-0">Te deben {grupo.saldo} €</p>
                                ) : grupo.saldo < 0 ? (
                                    <p className="text-yellow-400 text-xs m-0">Debes {Math.abs(grupo.saldo)} €</p>
                                ) : (
                                    <p className="text-gray-400 text-xs m-0">Saldado</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="md:col-span-8">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold">Transacciones Pendientes</h4>
                            <button 
                                className="border border-gray-500 text-gray-300 hover:text-white hover:border-white text-xs py-1 px-3 rounded-md transition-colors" 
                                onClick={funcionAñadirAmigo}
                            >
                                + Añadir amigo
                            </button>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <div className="grid grid-cols-3 text-xs text-gray-400 mb-4 border-b border-gray-700 pb-2">
                                <div>AMIGO</div>
                                <div className="text-center">GRUPO</div>
                                <div className="text-right">BALANCE</div>
                            </div>
                            
                            {amigos.length === 0 && (
                                <p className="text-gray-500 text-sm text-center italic mt-6">
                                    No hay deudas registradas con amigos.
                                </p>
                            )}

                            {amigos.map((amigo) => (
                                <div key={amigo.id} className="grid grid-cols-3 items-center text-sm mb-4 last:mb-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                                            {amigo.inicial}
                                        </div>
                                        {amigo.nombre}
                                    </div>
                                    <div className="text-gray-400 text-center text-xs">{amigo.grupo}</div>
                                    <div className={`text-right font-medium ${amigo.saldo > 0 ? 'text-green-500' : 'text-yellow-400'}`}>
                                        {amigo.saldo > 0 ? `Te debe ${amigo.saldo} €` : `Debes ${Math.abs(amigo.saldo)} €`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;