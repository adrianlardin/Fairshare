"use client";
import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Recuperar contraseña</h2>
        <p className="text-xs text-gray-400">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
        
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#eec24b]"
        />
        <button type="submit" className="w-full bg-[#eec24b] text-[#121212] py-3 rounded-lg font-bold text-sm hover:bg-[#d8ae3e] transition-colors">
          Enviar enlace
        </button>
        {message && <p className="text-xs text-center text-gray-300 mt-2">{message}</p>}
      </form>
    </div>
  );
}