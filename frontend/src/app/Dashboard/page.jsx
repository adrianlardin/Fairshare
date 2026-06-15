"use client";

import React, { useState, useEffect } from "react";

const colorVerde = "#10b981";
const colorAmarillo = "#f59e0b";
const fondoTarjeta = "#1f2937";
const colorBorde = "#374151";

const Dashboard = () => {
    const [usuario, setUsuario] = useState(null);

    const [grupos, setGrupos] = useState([
        { id: 1, nombre: "Piso", saldo: 180.00 },
        { id: 2, nombre: "Viaje", saldo: 10 },
        { id: 3, nombre: "Salida bar", saldo: -55.00 }
    ]);

    const [amigos, setAmigos] = useState([
        { id: 1, inicial: "P", nombre: "Pedro", grupo: "Piso", saldo: 100.00 },
        { id: 2, inicial: "A", nombre: "Andrea", grupo: "Piso", saldo: 80.00 },
        { id: 3, inicial: "L", nombre: "Lucía", grupo: "Salida bar", saldo: -55.00 }
    ]);

    return (
        <div className="container mt-5" style={{ color: "white" }}>
            <h1>Dashboard de Fairshare</h1>



            <div style={{ backgroundColor: fondoTarjeta, padding: "20px", borderRadius: "10px", border: `1px solid ${colorBorde}` }}>

                <ul>
                    <li>Grupos listos para mostrar: <strong>{grupos.length}</strong></li>
                    <li>Amigos listos para mostrar: <strong>{amigos.length}</strong></li>
                </ul>
                <p style={{ color: colorVerde, fontWeight: "bold" }}></p>
            </div>
        </div>
    );
};


export default Dashboard;