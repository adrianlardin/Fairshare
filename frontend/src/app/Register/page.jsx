"use client";

import { Navbar } from '@/components/navbar';
import React, { useState } from 'react';

const Register = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Datos de registro:", { name, lastname, username, email, password, agreeTerms });
    // Aquí iría tu lógica de autenticación
  };

  return (
    <div className="w-full min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 font-sans text-white">

      <Navbar />

      <div className="w-12 h-12 bg-[#008744]/20 border border-[#008744] text-[#008744] rounded-full flex items-center justify-center text-2xl font-bold mb-6">
        +
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-center mb-2">Crea tu cuenta</h1>
      <p className="text-gray-400 text-sm text-center mb-8">Regístrate para empezar a gestionar tus gastos compartidos.</p>

      <div className="w-full max-w-md bg-[#1a1a1a] border-t-2 border-[#eec24b] rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Nombre completo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                👤
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
            <label className="block text-xs font-medium text-gray-400 mb-2">Apellido</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                👤
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
            <label className="block text-xs font-medium text-gray-400 mb-2">Nombre de usuario</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                👤
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
            <label className="block text-xs font-medium text-gray-400 mb-2">Correo electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                ✉️
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
            <label className="block text-xs font-medium text-gray-400 mb-2">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                🔒
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
                {showPassword ? "👁️" : "🙈"}
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
            <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer select-none">
              Acepto los <span className="text-[#eec24b] hover:underline">Términos de servicio</span> y la <span className="text-[#eec24b] hover:underline">Privacidad</span>.
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
          <span className="flex-shrink mx-4 text-[10px] tracking-wider text-gray-500 font-mono font-medium uppercase">o continuar con</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-transparent border border-neutral-800 hover:bg-neutral-800/40 py-2.5 rounded-xl text-xs font-semibold transition-colors">
            <span>🌐</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-transparent border border-neutral-800 hover:bg-neutral-800/40 py-2.5 rounded-xl text-xs font-semibold transition-colors">
            <span>🍏</span> Apple
          </button>
        </div>

      </div>

      <p className="text-xs text-gray-400 mt-6">
        ¿Ya tienes una cuenta?{" "}
        <a href="/Login" className="text-[#eec24b] font-bold hover:underline ml-1">
          Inicia sesión
        </a>
      </p>

    </div>
  );
};

export default Register;