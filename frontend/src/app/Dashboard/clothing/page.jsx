"use client";

import { useEffect, useState } from "react";

export default function ClothingPage() {
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState("all");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            setCargando(true);
            try {
                const res = await fetch(`/api/clothing?category=${categoria}`);
                const data = await res.json();
                setProductos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar ropa:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarProductos();
    }, [categoria]);

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
                Catálogo de Moda & Ropa
            </h1>

            {/* Filtros por Categoría */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
                {[
                    { label: "Todos", value: "all" },
                    { label: "Hombre", value: "men's clothing" },
                    { label: "Mujer", value: "women's clothing" },
                    { label: "Joyería / Accesorios", value: "jewelery" }
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setCategoria(btn.value)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: "1px solid #ccc",
                            backgroundColor: categoria === btn.value ? "#0070f3" : "#fff",
                            color: categoria === btn.value ? "#fff" : "#333",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Grid de Productos */}
            {cargando ? (
                <p>Cargando catálogo...</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "1.5rem"
                    }}
                >
                    {productos.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                backgroundColor: "#fff"
                            }}
                        >
                            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                <img
                                    src={item.imagen}
                                    alt={item.titulo}
                                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                />
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>
                                    {item.categoria}
                                </span>
                                <h3 style={{ fontSize: "1rem", fontWeight: "600", margin: "0.5rem 0", lineHeight: "1.3" }}>
                                    {item.titulo.length > 45 ? item.titulo.substring(0, 45) + "..." : item.titulo}
                                </h3>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                                    <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>
                                        {item.precio.toFixed(2)} €
                                    </span>
                                    <span style={{ fontSize: "0.875rem", color: "#f59e0b" }}>
                                        ★ {item.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}