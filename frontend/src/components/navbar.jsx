"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#e2e8f0";
const MUTED = "#718096";
const NAV_LINKS = ["Caracteristicas", "Cómo funciona", "Contacto"];

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#4ADE80" fillOpacity="0.2" />
    <path d="M7 11h8M11 7v8" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const styles = {
    nav: {
    position: "absolute",
    width: "100vw",
    top: 0,
    zIndex: 100,
    background: "rgba(11,15,20,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${BORDER}`,
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 60,
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontWeight: 700, fontSize: 17, color: TEXT, letterSpacing: "-0.3px" },
  navLinks: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: 28,
    flex: 1,
  },
  navLink: { color: MUTED, textDecoration: "none", fontSize: 14, transition: "color .2s" },
  navActions: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" },
  loginBtn: { color: MUTED, textDecoration: "none", fontSize: 14, padding: "6px 12px" },
  dashboardBtn: { color: "#4ADE80", textDecoration: "none", fontSize: 14, padding: "6px 12px", fontWeight: 600 },
  userBtn: { color: TEXT, textDecoration: "none", fontSize: 14, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 },
  avatar: { width: 24, height: 24, borderRadius: "50%", objectFit: "cover", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 },
}

export function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || user.user_name || "");
        setLoggedIn(true);
      } catch (e) {
        setLoggedIn(false);
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <div style={styles.logo}>
          <LogoIcon />
          <Link href="/" style={styles.logoText}>FairShare</Link>
        </div>
        <ul style={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a href="#" style={styles.navLink}>{l}</a>
            </li>
          ))}
        </ul>
        <div style={styles.navActions}>
          {loggedIn ? (
            <>
              <Link href="/dashboard" style={styles.dashboardBtn}>Dashboard</Link>
              <Link href="/dashboard/profile" style={styles.userBtn}>
                <span style={styles.avatar}>
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </span>
                <span>{userName || "Usuario"}</span>
              </Link>
            </>
          ) : (
            <>
              <a href="/login" style={styles.loginBtn}>Iniciar sesion</a>
              <a href="/register" className="bg-[#F5C518] text-[#0b0f14] font-bold text-sm px-5 py-2 rounded-lg no-underline inline-block hover:opacity-90" style={{ backgroundColor: "#F5C518", color: "#0b0f14", fontWeight: 700, fontSize: 13, padding: "6px 14px", borderRadius: 8, textDecoration: "none" }}>
                Comenzar
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
