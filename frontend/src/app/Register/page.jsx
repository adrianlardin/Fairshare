"use client";

import { Navbar } from "@/components/navbar";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// ── Iconos (inline SVGs) ──────────────────────────────────────────────────────
const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#4ADE80" fillOpacity="0.2" />
    <path
      d="M7 11h8M11 7v8"
      stroke="#4ADE80"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);





// ── Componente Principal ────────────────────────────────────────────────────────
const Register = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000" + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          last_name: lastname,
          user_name: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Hubo un error al registrar el usuario.");
        return;
      }

      console.log("Registro exitoso:", data);
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      
      router.push('/login'); 

    } catch (error) {
      console.error("Error al registrar:", error);
      alert("No se pudo conectar con el servidor. Verifica que Flask esté encendido.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 font-sans text-white">
      <Navbar />

      <div className="mb-6">
        <LogoIcon />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-center mb-2">
        Crea tu cuenta
      </h1>
      <p className="text-gray-400 text-sm text-center mb-8">
        Regístrate para empezar a gestionar tus gastos compartidos.
      </p>

      <div className="w-full max-w-md bg-[#1e293b] border-t-2 border-[#3B82F6] rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserIcon />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-[#334155] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Apellido
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserIcon />
              </span>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Tu apellido"
                className="w-full bg-[#334155] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Nombre de usuario
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserIcon />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                className="w-full bg-[#334155] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="w-full bg-[#334155] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#334155] border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded bg-[#334155] border-slate-700 text-[#22C55E] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-400 cursor-pointer select-none"
            >
              Acepto los{" "}
              <span className="text-[#3B82F6] hover:underline">
                Términos de servicio
              </span>{" "}
              y la{" "}
              <span className="text-[#3B82F6] hover:underline">Privacidad</span>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#3B82F6] text-[#0f172a] py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-md
              ${isLoading ? 'opacity-50 cursor-not-allowed bg-slate-500 text-gray-300' : 'hover:bg-[#2563EB]'}`}
          >
            {isLoading ? "Procesando..." : "Registrarse →"}
          </button>
        </form>

      </div>

      <p className="text-xs text-gray-400 mt-6">
        ¿Ya tienes una cuenta?{" "}
        <a
          href="/login"
          className="text-[#3B82F6] font-bold hover:underline ml-1"
        >
          Inicia sesión
        </a>
      </p>
    </div>
  );
};

export default Register;
