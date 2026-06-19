"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GroupDetail() {
    const params = useParams();

    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://127.0.0.1:5000/group/${params.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener grupo");
                }

                const data = await response.json();
                setGroup(data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchGroup();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen text-white p-10">
                Cargando grupo...
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white p-10">

            <div className="flex justify-between items-center mb-10">

                <div>
                    <h1 className="text-4xl font-bold">
                        {group?.name}
                    </h1>

                    <p className="text-gray-400 mt-2">
                        {group?.description || "Grupo de gastos compartidos"}
                    </p>
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-3 rounded-lg font-bold transition-colors">
                    + Agregar gasto
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-green-500">
                    <p className="text-gray-400 text-xs mb-2">
                        TE DEBEN
                    </p>

                    <h2 className="text-green-500 text-3xl font-bold">
                        0.00 €
                    </h2>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 border-l-4 border-yellow-400">
                    <p className="text-gray-400 text-xs mb-2">
                        DEBES
                    </p>

                    <h2 className="text-yellow-400 text-3xl font-bold">
                        0.00 €
                    </h2>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">

                    <h2 className="text-xl font-bold mb-4">
                        Actividad reciente
                    </h2>

                    <p className="text-gray-400">
                        No hay gastos registrados.
                    </p>

                </div>

                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">

                    <h2 className="text-xl font-bold mb-4">
                        Miembros
                    </h2>

                    <p className="text-gray-400">
                        Próximamente.
                    </p>

                </div>

                <div className="lg:col-span-3 bg-gray-800 rounded-2xl p-6 border border-gray-700">

                    <h2 className="text-xl font-bold mb-4">
                        Información del grupo
                    </h2>

                    <div className="space-y-2 text-gray-400">
                        <p>ID: {group?.id}</p>
                        <p>Categoría: {group?.category || "General"}</p>
                        <p>Estado: Activo</p>
                    </div>

                </div>

            </div>

        </div>
    );
}