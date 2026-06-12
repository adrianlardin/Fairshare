"use client";

import { useState } from "react";
import "./login.css";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
 const handleLogin = async () => {
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Error al iniciar sesión");
      return;
    }

    console.log("Login correcto");
    console.log(data);

localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

router.push("/groups");

  } catch (err) {
    setError("Error al conectar con el servidor");
  }
};
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>FairShare</h1>
        <h2>Bienvenido de nuevo</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
            Iniciar sesión
        </button>

<p
  onClick={() => router.push("/Register")}
  style={{ cursor: "pointer" }}
>
  ¿No tienes cuenta? Regístrate
</p>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
