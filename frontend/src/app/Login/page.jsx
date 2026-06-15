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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}>
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
    // Aquí puedes añadir tu lógica de autenticación
    console.log({ email, password, rememberMe });
  };
 
  return (
  <div style={styles.container2}>
    
    <div style={styles.page}>
      <Navbar/>
      {/* Fondo decorativo con líneas abstractas simuladas por CSS */}
      <div style={styles.bgOverlay} />
      
      <div style={styles.container}>
        {/* Encabezado */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <LogoIcon />
          </div>
          <h1 style={styles.title}>Te damos la bienvenida</h1>
          <p style={styles.subtitle}>Inicia sesión para gestionar tus gastos compartidos.</p>
        </div>
 
        {/* Tarjeta de Login */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* Input Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><MailIcon /></span>
                <input
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>
 
            {/* Input Password */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Contraseña</label>
                <a href="#" style={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
              </div>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><LockIcon /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <span style={styles.inputIconRight}><EyeOffIcon /></span>
              </div>
            </div>
 
            {/* Checkbox Remember Me */}
            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="remember" style={styles.checkboxLabel}>
                Recordarme por 30 días
              </label>
            </div>
 
            {/* Botón Principal de Sign In */}
            <button type="submit" style={styles.signInBtn}>
              Iniciar sesión <span>→</span>
            </button>
 
            {/* Separador */}
            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>O CONTINUAR CON</span>
              <div style={styles.dividerLine} />
            </div>
 
            {/* Botones de Proveedores Sociales */}
            <div style={styles.socialRow}>
              <button type="button" style={styles.socialBtn}>
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button type="button" style={styles.socialBtn}>
                <AppleIcon />
                <span>Apple</span>
              </button>
            </div>
 
          </form>
        </div>
 
        {/* Footer del Login */}
        <div style={styles.footer}>
          <span style={styles.footerText}>¿No tienes una cuenta? </span>
          <a href="#" style={styles.signUpLink}>Regístrate</a>
        </div>
      </div>
    </div>
  </div>
  );
}
 
// ── Estilos correspondientes a la imagen ─────────────────────────────────────────
const BG = "#111111"; // Fondo oscuro de la imagen
const CARD_BG = "#222222"; // Tarjeta gris oscuro
const ACCENT_YELLOW = "#F3D04C"; // Color amarillo del botón principal
const TEXT_LIGHT = "#E2E8F0"; 
const TEXT_MUTED = "#8E8E8E";
const INPUT_BG = "#333333";
const BORDER_COLOR = "rgba(255, 255, 255, 0.08)";
 
const styles = {
  container2: {
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  page: {
    background: BG,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    overflowY: "auto",
    padding: "24px",
    zIndex: 20,
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 80% 20%, rgba(243,208,76,0.03) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(74,222,128,0.02) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: 440,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    zIndex: 10,
  },
  header: {
    textAlign: "center",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    color: TEXT_LIGHT,
    fontSize: 28,
    fontWeight: 600,
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: 14,
    margin: 0,
  },
  card: {
    background: CARD_BG,
    borderRadius: 12,
    borderTop: `2px solid ${ACCENT_YELLOW}`, // Detalle de la línea superior amarilla
    borderLeft: `1px solid ${BORDER_COLOR}`,
    borderRight: `1px solid ${BORDER_COLOR}`,
    borderBottom: `1px solid ${BORDER_COLOR}`,
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.5px",
    flex: 1,
  },
  forgotLink: {
    color: ACCENT_YELLOW,
    fontSize: 11,
    textDecoration: "none",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    display: "flex",
    alignItems: "center",
  },
  inputIconRight: {
    position: "absolute",
    right: 12,
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    background: INPUT_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: 6,
    padding: "12px 12px 12px 38px",
    color: TEXT_LIGHT,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    accentColor: ACCENT_YELLOW,
    cursor: "pointer",
    width: 15,
    height: 15,
  },
  checkboxLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    cursor: "pointer",
    userSelect: "none",
    letterSpacing: "0.5px",
  },
  signInBtn: {
    background: ACCENT_YELLOW,
    color: "#111111",
    border: "none",
    borderRadius: 6,
    padding: "14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "8px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: BORDER_COLOR,
  },
  dividerText: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "1px",
  },
  socialRow: {
    display: "flex",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    background: "transparent",
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: 6,
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: TEXT_LIGHT,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  footer: {
    textAlign: "center",
    fontSize: 14,
  },
  footerText: {
    color: TEXT_MUTED,
  },
  signUpLink: {
    color: ACCENT_YELLOW,
    textDecoration: "none",
    fontWeight: 600,
  },
};