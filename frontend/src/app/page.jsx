"use client";

import { useRouter } from "next/navigation";
import "./page.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1>FairShare</h1>

        <p>
          Gestiona y comparte gastos con amigos, familia o compañeros de forma
          rápida y sencilla.
        </p>
        <div className="landing-buttons">
          <button onClick={() => router.push("/Login")}>Iniciar sesión</button>

          <button onClick={() => router.push("/Register")}>Registrarse</button>
        </div>
      </div>
    </div>
  );
}
