"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          user_name: userName,
          name,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      console.log("Respuesta:", data);
      console.log("Status:", response.status);

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Usuario creado correctamente");

      setTimeout(() => {
        router.push("/Login");
      }, 2000);

    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>FairShare</h1>
        <h2>Crear cuenta</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

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

        <button onClick={handleRegister}>Crear cuenta</button>

        <p onClick={() => router.push("/Login")} style={{ cursor: "pointer" }}>
          ¿Ya tienes cuenta? Inicia sesión
        </p>
        {error && <p className="error-message">{error}</p>}

        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}
