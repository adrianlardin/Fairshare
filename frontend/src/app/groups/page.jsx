"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://127.0.0.1:5000/groups",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener grupos");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setGroups(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-white p-10">

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold">
                        Grupos
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Gestiona los gastos compartidos de tus grupos.
                    </p>
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-3 rounded-lg transition-colors">
                    + Crear grupo
                </button>
            </div>

            {loading ? (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    Cargando grupos...
                </div>
            ) : groups.length === 0 ? (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <p className="text-gray-400">
                        Aún no perteneces a ningún grupo.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {groups.map((group) => (
                        <Link
                            key={group.id}
                            href={`/groups/${group.id}`}
                            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400 transition-all"
                        >
                            <h2 className="text-xl font-bold mb-3">
                                {group.name}
                            </h2>

                            <p className="text-gray-400 mb-4">
                                {group.description || "Sin descripción"}
                            </p>

                            <span className="text-yellow-400 text-sm">
                                {group.category || "General"}
                            </span>
                        </Link>
                    ))}

                </div>
            )}

        </div>
    );
}