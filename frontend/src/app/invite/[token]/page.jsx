"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InvitePage() {
    const { token } = useParams();
    const router = useRouter();
    const [estado, setEstado] = useState("cargando");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const unirseAlGrupo = async () => {
            const jwt = localStorage.getItem("token");

            if (!jwt) {
                localStorage.setItem("redirectAfterLogin", `/invite/${token}`);
                router.push("/login");
                return;
            }

            try {
                const respuesta = await fetch(`http://localhost:5000/groups/join/${token}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    }
                });

                const datos = await respuesta.json();

                if (respuesta.ok) {
                    setEstado("exito");
                    setMensaje(datos.message || "Te has unido al grupo correctamente");
                    setTimeout(() => {
                        router.push(`/dashboard/groups/${datos.group_id}`);
                    }, 1500);
                } else {
                    setEstado("error");
                    setMensaje(datos.error || "No se pudo unir al grupo");
                }
            } catch (error) {
                setEstado("error");
                setMensaje("Error de conexion con el servidor");
            }
        };

        if (token) unirseAlGrupo();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
            <div className="bg-[#1e293b] rounded-2xl p-8 border border-gray-700 text-center max-w-md w-full shadow-2xl">
                {estado === "cargando" && (
                    <>
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-white mb-2">Uniendote al grupo...</h1>
                        <p className="text-sm text-gray-400">Procesando tu invitacion.</p>
                    </>
                )}

                {estado === "exito" && (
                    <>
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">Listo</h1>
                        <p className="text-sm text-gray-400">{mensaje}</p>
                        <p className="text-xs text-gray-500 mt-2">Redirigiendo al grupo...</p>
                    </>
                )}

                {estado === "error" && (
                    <>
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">Error</h1>
                        <p className="text-sm text-gray-400">{mensaje}</p>
                        <button
                            onClick={() => router.push("/dashboard/groups")}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-black font-bold px-4 py-2 rounded-md text-sm transition-colors"
                        >
                            Ir a mis grupos
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
