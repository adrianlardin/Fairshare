"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Extraemos el token de la URL (?token=xxxx)
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json();

      if (response.ok) {
        alert("¡Contraseña restablecida con éxito!");
        router.push('/Login');
      } else {
        setMessage(data.error || "Ocurrió un error.");
      }
    } catch (error) {
      setMessage("Error de red al conectar con el servidor.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Nueva contraseña</h2>
        
        <div>
          <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Nueva Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#eec24b]"
          />
        </div>

        <div>
          <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Confirmar Contraseña</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#eec24b]"
          />
        </div>

        <button type="submit" className="w-full bg-[#eec24b] text-[#121212] py-3 rounded-lg font-bold text-sm hover:bg-[#d8ae3e] transition-colors">
          Restablecer contraseña
        </button>
        {message && <p className="text-xs text-center text-red-400 mt-2">{message}</p>}
      </form>
    </div>
  );
}