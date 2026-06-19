const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#e2e8f0";
const MUTED = "#718096";
const NAV_LINKS = ["Características", "Cómo funciona", "Precios"];

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
}

export function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <div style={styles.logo}>
          <LogoIcon />
          <span style={styles.logoText}>FairShare</span>
        </div>
        <ul style={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a href="#" style={styles.navLink}>{l}</a>
            </li>
          ))}
        </ul>
        <div style={styles.navActions}>
          <a href="/Login" style={styles.loginBtn} >Iniciar sesión</a>
          <a href="/Register" style={styles.primaryBtn}>Comenzar</a>
        </div>
      </div>
    </nav>
  );
}