"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./home.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/Login");
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/Login");
  };

  return (
    <div className="home-container">

      <div className="home-card">

        <h1>FairShare</h1>

        <h2>Hola {user?.name} 👋</h2>

        <p>Bienvenida de nuevo</p>

        <div className="menu-buttons">

          <button>👥 Mis grupos</button>

          <button>💰 Gastos</button>

          <button>📊 Resumen</button>

          <button>⚙️ Mi perfil</button>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Cerrar sesión
        </button>

      </div>

    </div>
  );
}