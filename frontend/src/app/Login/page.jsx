"use client";
 
import { Navbar } from "@/components/navbar";
import { useState } from "react";
 
// ── Iconos (inline SVGs basados en la imagen) ──────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
 
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
 
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
 
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#4ADE80" fillOpacity="0.2" />
    <path d="M7 11h8M11 7v8" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
 
const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e2e8f0">
    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.884H12.24z"/>
  </svg>
);
 
const AppleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e2e8f0">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96 1.07.08 2.18-.54 2.84-1.35z"/>
  </svg>
);
 
// ── Componente Principal ────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };
 
  return (
    <div className="flex flex-col relative">
      
      {/* Contenedor de la página con posicionamiento fixed */}
      <div className="bg-[#111111] fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center overflow-y-auto p-6 z-20 font-sans antialiased">
        
        {/* Tu Navbar integrado */}
        <Navbar/>
        
        {/* Fondo decorativo con gradientes radiales */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(243,208,76,0.03)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(74,222,128,0.02)_0%,transparent_50%)] pointer-events-none" />
        
        {/* Estructura del Login */}
        <div className="w-full max-w-[440px] flex flex-col gap-6 z-10">
          
          {/* Encabezado */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <LogoIcon />
            </div>
            <h1 className="text-[#E2E8F0] text-[28px] font-semibold m-0 mb-2 tracking-tight">
              Te damos la bienvenida
            </h1>
            <p className="text-[#8E8E8E] text-sm m-0">
              Inicia sesión para gestionar tus gastos compartidos.
            </p>
          </div>
 
          {/* Tarjeta de Login */}
          <div className="bg-[#222222] rounded-xl border-t-2 border-t-[#F3D04C] border-x border-b border-white/8 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Input Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[#8E8E8E] text-xs font-medium tracking-wider">
                  Correo electrónico
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 flex items-center">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#333333] border border-white/8 rounded-md py-3 pl-[38px] pr-3 text-[#E2E8F0] text-sm outline-none transition-colors duration-200 focus:border-[#F3D04C]/50"
                    required
                  />
                </div>
              </div>
 
              {/* Input Password */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center w-full">
                  <label className="text-[#8E8E8E] text-xs font-medium tracking-wider">
                    Contraseña
                  </label>
                  <a href="#" className="text-[#F3D04C] text-[11px] no-underline font-medium tracking-wider hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 flex items-center">
                    <LockIcon />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#333333] border border-white/8 rounded-md py-3 pl-[38px] pr-[38px] text-[#E2E8F0] text-sm outline-none transition-colors duration-200 focus:border-[#F3D04C]/50"
                    required
                  />
                  <span className="absolute right-3 flex items-center">
                    <EyeOffIcon />
                  </span>
                </div>
              </div>
 
              {/* Checkbox Remember Me */}
              <div className="flex items-center gap-[10px]">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#F3D04C] cursor-pointer w-[15px] h-[15px]"
                />
                <label htmlFor="remember" className="text-[#8E8E8E] text-xs cursor-pointer select-none tracking-wider">
                  Recordarme por 30 días
                </label>
              </div>
 
              {/* Botón Principal de Sign In */}
              <button type="submit" className="bg-[#F3D04C] text-[#111111] border-none rounded-md py-3.5 text-span font-semibold cursor-pointer flex items-center justify-center gap-2 transition-opacity duration-200 hover:opacity-90">
                Iniciar sesión <span>→</span>
              </button>
 
              {/* Separador */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-[1px] bg-white/8" />
                <span className="text-[#8E8E8E] text-[10px] font-semibold tracking-widest">
                  O CONTINUAR CON
                </span>
                <div className="flex-1 h-[1px] bg-white/8" />
              </div>
 
              {/* Botones de Proveedores Sociales */}
              <div className="flex gap-3">
                <button type="button" className="flex-1 bg-transparent border border-white/8 rounded-md py-2.5 flex items-center justify-center gap-2 text-[#E2E8F0] text-xs font-medium cursor-pointer transition-colors duration-200 hover:bg-white/5">
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button type="button" className="flex-1 bg-transparent border border-white/8 rounded-md py-2.5 flex items-center justify-center gap-2 text-[#E2E8F0] text-xs font-medium cursor-pointer transition-colors duration-200 hover:bg-white/5">
                  <AppleIcon />
                  <span>Apple</span>
                </button>
              </div>
 
            </form>
          </div>
 
          {/* Footer del Login */}
          <div className="text-center text-sm">
            <span className="text-[#8E8E8E]">¿No tienes una cuenta? </span>
            <a href="/Register" className="text-[#F3D04C] no-underline font-semibold hover:underline">
              Regístrate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}