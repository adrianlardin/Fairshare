"use client";

import { Navbar } from "@/components/navbar";
import React, { useState } from "react";

// ── Iconos (inline SVGs) ──────────────────────────────────────────────────────
const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#718096"
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
    stroke="#718096"
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
    stroke="#718096"
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
    stroke="#718096"
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
    stroke="#718096"
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

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e2e8f0">
    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.884H12.24z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e2e8f0">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96 1.07.08 2.18-.54 2.84-1.35z" />
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
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 font-sans text-white">
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

      <div className="w-full max-w-md bg-[#1a1a1a] border-t-2 border-[#eec24b] rounded-2xl p-8 shadow-2xl">
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
                className="w-full bg-[#262626] border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#eec24b] transition-colors"
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
                className="w-full bg-[#262626] border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#eec24b] transition-colors"
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
                className="w-full bg-[#262626] border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#eec24b] transition-colors"
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
                className="w-full bg-[#262626] border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#eec24b] transition-colors"
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
                className="w-full bg-[#262626] border border-neutral-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#eec24b] transition-colors"
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
              className="w-4 h-4 rounded bg-[#262626] border-neutral-800 text-[#008744] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-400 cursor-pointer select-none"
            >
              Acepto los{" "}
              <span className="text-[#eec24b] hover:underline">
                Términos de servicio
              </span>{" "}
              y la{" "}
              <span className="text-[#eec24b] hover:underline">Privacidad</span>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#eec24b] text-[#121212] py-3.5 rounded-xl font-bold text-sm hover:bg-[#d8ae3e] transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
          >
            Registrarse →
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink mx-4 text-[10px] tracking-wider text-gray-500 font-mono font-medium uppercase">
            o continuar con
          </span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-transparent border border-neutral-800 hover:bg-neutral-800/40 py-2.5 rounded-xl text-xs font-semibold transition-colors">
            <GoogleIcon /> Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-transparent border border-neutral-800 hover:bg-neutral-800/40 py-2.5 rounded-xl text-xs font-semibold transition-colors">
            <AppleIcon /> Apple
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        ¿Ya tienes una cuenta?{" "}
        <a
          href="/login"
          className="text-[#eec24b] font-bold hover:underline ml-1"
        >
          Inicia sesión
        </a>
      </p>
    </div>
  );
};

export default Register;
