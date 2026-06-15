"use client";
 
import { useState } from "react";
 
// ── Icons (inline SVGs para no depender de librerías) ──────────────────────────
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#4ADE80" fillOpacity="0.15" />
    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
 
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="#F5C518">
    <path d="M7 1l1.545 4.236H13l-3.59 2.609L10.727 13 7 10.09 3.273 13l1.318-5.155L1 5.236h4.455z" />
  </svg>
);
 
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#4ADE80" fillOpacity="0.2" />
    <path d="M7 11h8M11 7v8" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
 
// ── Datos ───────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Características", "Cómo funciona", "Precios"];
 
const TRUSTED_BY = ["PayNow", "Vanguard", "SkillBound", "InsightX", "Fortify"];
 
const FEATURES_CARDS = [
  {
    icon: "⚡",
    title: "Sincronización en tiempo real",
    desc: "Cada gasto se refleja instantáneamente en todos los dispositivos. Todo el mundo está siempre al día durante los viajes.",
  },
  {
    icon: "🏷️",
    title: "Categorización inteligente",
    desc: "La IA clasifica automáticamente los gastos en categorías relevantes, ofreciendo un análisis más profundo de tus hábitos de consumo.",
  },
  {
    icon: "⚖️",
    title: "Cuentas claras",
    desc: "Algoritmos avanzados calculan la forma más eficiente de saldar deudas, minimizando el número total de transacciones.",
  },
];
 
const GROUP_BULLETS = [
  "Porcentajes de división personalizados por persona",
  "Soporte multidivisa con conversión automática",
  "Chat específico por grupo y almacenamiento de recibos",
];
 
const EXPENSE_BADGES = ["OCR de Recibos", "Sincronización Bancaria"];
 
const PERSONAL_TOGGLES = ["Conectado con tu círculo social"];
 
const PRICING = [
  {
    tier: "INICIAL",
    label: "Gratis",
    price: null,
    sub: "Para particulares y viajes ocasionales.",
    features: ["Grupos ilimitados", "Seguimiento manual de gastos", "Informes estándar"],
    cta: "Empieza Gratis",
    highlight: false,
  },
  {
    tier: "RECOMENDADO",
    label: "$9",
    period: "/mes",
    sub: "Ideal para viajeros frecuentes y organizadores.",
    features: [
      "Grupos activos ilimitados",
      "Escaneo de recibos por OCR",
      "Sincronización bancaria en tiempo real",
      "Informes y analíticas avanzadas",
    ],
    cta: "Comenzar ahora",
    highlight: true,
  },
  {
    tier: "COLABORAR",
    label: "$29",
    period: "/mes",
    sub: "Optimizado para pequeñas empresas y equipos.",
    features: [
      "Incluye hasta 20 usuarios",
      "Integración de tarjetas corporativas",
      "Soporte prioritario 24/7",
      "Exportación a software de contabilidad",
    ],
    cta: "Obtener para el Equipo",
    highlight: false,
  },
];
 
const FOOTER_COLS = {
  Producto: ["Características", "Cómo funciona", "Precios"],
  Legal: ["Política de Privacidad", "Términos de Servicio", "Contacto"],
};
 
// ── Sub-components ──────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <div style={styles.logo}>
          <LogoIcon />
          <span style={styles.logoText}>SplitSync</span>
        </div>
        <ul style={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a href="#" style={styles.navLink}>{l}</a>
            </li>
          ))}
        </ul>
        <div style={styles.navActions}>
          <a href="#" style={styles.loginBtn}>Iniciar sesión</a>
          <a href="#" style={styles.primaryBtn}>Comenzar</a>
        </div>
      </div>
    </nav>
  );
}
 
function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroHeadline}>
          Finanzas, <span style={styles.accentGreen}>sincronizadas.</span>
          <br />Amistades, a salvo.
        </h1>
        <p style={styles.heroSub}>
          La aplicación de gastos compartidos de alto rendimiento diseñada para equipos modernos,
          compañeros de piso y viajeros que valoran la precisión y la claridad.
        </p>
        <div style={styles.heroCtas}>
          <a href="#" style={styles.primaryBtn}>Empieza gratis →</a>
          <a href="#" style={styles.watchDemo}>▶ Ver Demo</a>
        </div>
      </div>
 
      {/* Dashboard mockup */}
      <div style={styles.heroMockupWrap}>
        <div style={styles.heroMockup}>
          <div style={styles.mockupScreen}>
            <div style={styles.mockupBar}>
              <span style={styles.mockupDot} />
              <span style={{ ...styles.mockupDot, background: "#F5C518" }} />
              <span style={{ ...styles.mockupDot, background: "#4ADE80" }} />
            </div>
            {/* Fake chart bars */}
            <div style={styles.mockupChartArea}>
              {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.mockupBar2,
                    height: `${h}%`,
                    background: i === 10 ? "#4ADE80" : "rgba(74,222,128,0.3)",
                  }}
                />
              ))}
            </div>
            {/* Fake stat bubbles */}
            <div style={styles.mockupStats}>
              {["$1,240", "$380", "$860"].map((v, i) => (
                <div key={i} style={styles.mockupStatBubble}>
                  <span style={styles.mockupStatVal}>{v}</span>
                  <span style={styles.mockupStatLabel}>
                    {["Total", "Saldado", "Pendiente"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 
function TrustedBy() {
  return (
    <div style={styles.trustedWrap}>
      <p style={styles.trustedLabel}>CON LA CONFIANZA DE STARTUPS Y EMPRESAS EN CRECIMIENTO EN TODO EL MUNDO</p>
      <div style={styles.trustedLogos}>
        {TRUSTED_BY.map((name) => (
          <span key={name} style={styles.trustedLogo}>{name}</span>
        ))}
      </div>
    </div>
  );
}
 
function FeaturesSection() {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Precisión en cada transacción</h2>
      <p style={styles.sectionSub}>
        Tres pilares que definen nuestro compromiso con tu claridad financiera.
      </p>
      <div style={styles.cardsRow}>
        {FEATURES_CARDS.map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureCardTitle}>{f.title}</h3>
            <p style={styles.featureCardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
 
function GroupManagement() {
  return (
    <section style={styles.splitSection}>
      <div style={styles.splitText}>
        <span style={styles.eyebrow}>GESTIÓN DE GRUPOS</span>
        <h2 style={styles.splitHeadline}>
          Coordínate sin esfuerzo<br />con cualquier grupo
        </h2>
        <p style={styles.splitDesc}>
          Ya sea el alquiler familiar, los gastos con compañeros de piso o una escapada de fin de
          semana con amigos. Gestiona múltiples círculos con libros de contabilidad específicos y reglas de división personalizadas.
        </p>
        <ul style={styles.bulletList}>
          {GROUP_BULLETS.map((b) => (
            <li key={b} style={styles.bulletItem}>
              <CheckIcon /> {b}
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.splitMockup}>
        <PhoneMockup type="group" />
      </div>
    </section>
  );
}
 
function ExpenseTracking() {
  return (
    <section style={{ ...styles.splitSection, flexDirection: "row-reverse", background: "transparent" }}>
      <div style={styles.splitMockup}>
        <PhoneMockup type="expense" />
      </div>
      <div style={styles.splitText}>
        <span style={styles.eyebrow}>CONTROL DE GASTOS</span>
        <h2 style={styles.splitHeadline}>
          Registra cada detalle en<br />segundos
        </h2>
        <p style={styles.splitDesc}>
          El registro manual es cosa del pasado. Escanea recibos, importa transacciones bancarias
          y realiza el seguimiento de facturas recurrentes con precisión milimétrica.
        </p>
        <div style={styles.badgesRow}>
          {EXPENSE_BADGES.map((b) => (
            <div key={b} style={styles.badge}>{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
 
function PersonalExperience() {
  return (
    <section style={styles.splitSection}>
      <div style={styles.splitText}>
        <span style={styles.eyebrow}>EXPERIENCIA PERSONALIZADA</span>
        <h2 style={styles.splitHeadline}>
          Tus finanzas,<br />tus reglas
        </h2>
        <p style={styles.splitDesc}>
          Personaliza tu panel de control, configura alertas de presupuesto y gestiona tus preferencias
          de seguridad. SplitSync se adapta a tu estilo de vida financiero único.
        </p>
        <div style={styles.toggleRow}>
          <div style={styles.togglePill}>
            <div style={styles.toggleThumb} />
          </div>
          <span style={styles.toggleLabel}>Conectado con tu círculo social</span>
        </div>
      </div>
      <div style={styles.splitMockup}>
        <PhoneMockup type="personal" />
      </div>
    </section>
  );
}
 
function PhoneMockup({ type }) {
  const colors = { group: "#4ADE80", expense: "#F5C518", personal: "#818CF8" };
  const accent = colors[type] || "#4ADE80";
  return (
    <div style={{ ...styles.phoneMockup, borderColor: `${accent}30` }}>
      <div style={styles.phoneScreen}>
        <div style={{ ...styles.phoneAccentBar, background: accent }} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={styles.phoneLine}>
            <div style={{ ...styles.phoneLineDot, background: i === 1 ? accent : "#2d3748" }} />
            <div style={{ ...styles.phoneLineBar, width: `${60 + i * 8}%` }} />
          </div>
        ))}
        <div style={{ ...styles.phoneBtn, background: accent }} />
      </div>
    </div>
  );
}
 
function Pricing() {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Elige tu nivel de sincronización</h2>
      <p style={styles.sectionSub}>Precios sencillos para todo el mundo.</p>
      <div style={styles.pricingRow}>
        {PRICING.map((p) => (
          <div key={p.tier} style={p.highlight ? styles.pricingCardHL : styles.pricingCard}>
            {p.highlight && <div style={styles.pricingBadge}>PLAN RECOMENDADO</div>}
            <span style={styles.pricingTier}>{p.tier}</span>
            <div style={styles.pricingPrice}>
              <span style={styles.pricingAmount}>{p.label}</span>
              {p.period && <span style={styles.pricingPeriod}>{p.period}</span>}
            </div>
            <p style={styles.pricingSub}>{p.sub}</p>
            <ul style={styles.pricingFeatures}>
              {p.features.map((f) => (
                <li key={f} style={styles.pricingFeature}>
                  <CheckIcon /> {f}
                </li>
              ))}
            </ul>
            <button style={p.highlight ? styles.primaryBtnFull : styles.ghostBtnFull}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
 
function FinalCTA() {
  return (
    <section style={styles.finalCta}>
      <h2 style={styles.finalCtaTitle}>¿Listo para simplificar tu vida compartida?</h2>
      <p style={styles.finalCtaSub}>
        Únete a los 519,371 usuarios que ya han alcanzado la claridad financiera y
        comparten gastos sin estrés.
      </p>
      <a href="#" style={styles.primaryBtn}>Empieza gratis →</a>
      <p style={styles.finalCtaNote}>Sin tarjeta de crédito · Cancela cuando quieras</p>
    </section>
  );
}
 
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div style={styles.footerBrand}>
          <div style={styles.logo}>
            <LogoIcon />
            <span style={styles.logoText}>SplitSync</span>
          </div>
          <p style={styles.footerTagline}>
            Claridad financiera precisa para equipos modernos.
          </p>
        </div>
        {Object.entries(FOOTER_COLS).map(([col, links]) => (
          <div key={col}>
            <p style={styles.footerColTitle}>{col.toUpperCase()}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.map((l) => (
                <li key={l} style={{ marginBottom: 8 }}>
                  <a href="#" style={styles.footerLink}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p style={styles.footerColTitle}>BOLETÍN INFORMATIVO</p>
          <p style={styles.footerTagline}>Recibe los últimos consejos sobre gestión de gastos.</p>
          <div style={styles.newsletterRow}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              style={styles.newsletterInput}
            />
            <button style={styles.newsletterBtn}>→</button>
          </div>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <span>© 2025 SplitSync. Claridad financiera precisa para equipos modernos. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
 
// ── Styles ──────────────────────────────────────────────────────────────────────
const BG = "#171717";
const BG2 = "#111720";
const GREEN = "#4ADE80";
const YELLOW = "#F5C518";
const TEXT = "#e2e8f0";
const MUTED = "#718096";
const BORDER = "rgba(255,255,255,0.07)";
const CARD_BG = "#131a24";
 
const styles = {
  // Layout
  page: {
    background: BG,
    color: TEXT,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    minHeight: "100vh",
    lineHeight: 1.6,
  },
 
  // Nav
  nav: {
    position: "sticky",
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
 
  // Buttons
  primaryBtn: {
    background: YELLOW,
    color: "#0b0f14",
    fontWeight: 700,
    fontSize: 14,
    padding: "10px 20px",
    borderRadius: 8,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    display: "inline-block",
  },
  primaryBtnFull: {
    background: YELLOW,
    color: "#0b0f14",
    fontWeight: 700,
    fontSize: 14,
    padding: "12px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginTop: "auto",
  },
  ghostBtnFull: {
    background: "transparent",
    color: TEXT,
    fontWeight: 600,
    fontSize: 14,
    padding: "12px 20px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    cursor: "pointer",
    width: "100%",
    marginTop: "auto",
  },
 
  // Hero
  hero: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "80px 24px 60px",
    display: "flex",
    alignItems: "center",
    gap: 48,
  },
  heroContent: { flex: 1 },
  heroHeadline: {
    fontSize: "clamp(36px, 5vw, 58px)",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-1.5px",
    margin: "0 0 20px",
    color: "#f8fafc",
  },
  accentGreen: { color: GREEN },
  heroSub: { color: MUTED, fontSize: 16, maxWidth: 460, margin: "0 0 32px" },
  heroCtas: { display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  watchDemo: {
    color: TEXT,
    textDecoration: "none",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
 
  // Hero mockup
  heroMockupWrap: { flex: 1, display: "flex", justifyContent: "center" },
  heroMockup: {
    background: "linear-gradient(135deg, #131a24 0%, #0f1923 100%)",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
  },
  mockupScreen: { background: "#0b0f14", borderRadius: 8, padding: 16, minHeight: 220 },
  mockupBar: { display: "flex", gap: 6, marginBottom: 16 },
  mockupDot: { width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" },
  mockupChartArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: 4,
    height: 100,
    marginBottom: 16,
  },
  mockupBar2: { flex: 1, borderRadius: "3px 3px 0 0", minWidth: 8 },
  mockupStats: { display: "flex", gap: 12 },
  mockupStatBubble: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "8px 12px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  mockupStatVal: { color: GREEN, fontWeight: 700, fontSize: 15 },
  mockupStatLabel: { color: MUTED, fontSize: 11 },
 
  // Trusted
  trustedWrap: { textAlign: "center", padding: "40px 24px", borderTop: `1px solid ${BORDER}` },
  trustedLabel: { color: MUTED, fontSize: 11, letterSpacing: "1.5px", marginBottom: 24 },
  trustedLogos: { display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap" },
  trustedLogo: { color: "#4a5568", fontWeight: 700, fontSize: 13, letterSpacing: "0.5px" },
 
  // Sections
  section: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "80px 24px",
    textAlign: "center",
  },
  sectionTitle: { fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 12px", color: "#f8fafc" },
  sectionSub: { color: MUTED, fontSize: 15, maxWidth: 500, margin: "0 auto 48px" },
 
  // Feature cards
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    textAlign: "left",
  },
  featureCard: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 24,
  },
  featureIcon: { fontSize: 22, marginBottom: 14 },
  featureCardTitle: { fontWeight: 700, fontSize: 16, margin: "0 0 8px", color: "#f8fafc" },
  featureCardDesc: { color: MUTED, fontSize: 14, margin: 0 },
 
  // Split sections
  splitSection: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "80px 24px",
    display: "flex",
    alignItems: "center",
    gap: 64,
    flexWrap: "wrap",
  },
  splitText: { flex: 1, minWidth: 280 },
  splitMockup: { flex: 1, minWidth: 260, display: "flex", justifyContent: "center" },
  eyebrow: { color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: "2px" },
  splitHeadline: { fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.6px", margin: "10px 0 16px", color: "#f8fafc" },
  splitDesc: { color: MUTED, fontSize: 15, margin: "0 0 24px", lineHeight: 1.7 },
 
  bulletList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  bulletItem: { display: "flex", alignItems: "center", gap: 10, color: TEXT, fontSize: 14 },
 
  badgesRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  badge: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    color: TEXT,
    fontWeight: 600,
  },
 
  toggleRow: { display: "flex", alignItems: "center", gap: 12 },
  togglePill: {
    width: 42,
    height: 22,
    background: GREEN,
    borderRadius: 11,
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  toggleThumb: { width: 18, height: 18, background: "#fff", borderRadius: "50%" },
  toggleLabel: { fontSize: 14, color: TEXT },
 
  // Phone mockup
  phoneMockup: {
    background: CARD_BG,
    border: "1px solid",
    borderRadius: 20,
    padding: 16,
    width: 220,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  phoneScreen: { display: "flex", flexDirection: "column", gap: 10 },
  phoneAccentBar: { height: 4, borderRadius: 2, width: "60%" },
  phoneLine: { display: "flex", alignItems: "center", gap: 10 },
  phoneLineDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  phoneLineBar: { height: 8, background: "#1e2d3d", borderRadius: 4 },
  phoneBtn: { height: 36, borderRadius: 8, marginTop: 8, opacity: 0.9 },
 
  // Pricing
  pricingRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    textAlign: "left",
    alignItems: "stretch",
  },
  pricingCard: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  pricingCardHL: {
    background: "linear-gradient(145deg, #131a24 0%, #162130 100%)",
    border: `1px solid ${GREEN}40`,
    borderRadius: 14,
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: `0 0 30px ${GREEN}15`,
  },
  pricingBadge: {
    background: `${GREEN}20`,
    color: GREEN,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    padding: "4px 10px",
    borderRadius: 6,
    display: "inline-block",
    alignSelf: "flex-start",
  },
  pricingTier: { color: MUTED, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px" },
  pricingPrice: { display: "flex", alignItems: "flex-end", gap: 2 },
  pricingAmount: { fontSize: 40, fontWeight: 800, color: "#f8fafc", letterSpacing: "-1px", lineHeight: 1 },
  pricingPeriod: { color: MUTED, fontSize: 14, paddingBottom: 4 },
  pricingSub: { color: MUTED, fontSize: 13, margin: 0 },
  pricingFeatures: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  pricingFeature: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: TEXT },
 
  // Final CTA
  finalCta: {
    background: BG2,
    borderTop: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`,
    textAlign: "center",
    padding: "80px 24px",
  },
  finalCtaTitle: { fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 12px", color: "#f8fafc" },
  finalCtaSub: { color: MUTED, fontSize: 15, maxWidth: 500, margin: "0 auto 28px" },
  finalCtaNote: { color: MUTED, fontSize: 12, marginTop: 14 },
 
  // Footer
  footer: { background: "#080c10", padding: "60px 24px 24px", borderTop: `1px solid ${BORDER}` },
  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 2fr",
    gap: 40,
    paddingBottom: 40,
    borderBottom: `1px solid ${BORDER}`,
    flexWrap: "wrap",
  },
  footerBrand: {},
  footerTagline: { color: MUTED, fontSize: 13, marginTop: 10, lineHeight: 1.6 },
  footerColTitle: { color: TEXT, fontWeight: 700, fontSize: 12, letterSpacing: "1.2px", marginBottom: 16, marginTop: 0 },
  footerLink: { color: MUTED, textDecoration: "none", fontSize: 13 },
  footerBottom: {
    maxWidth: 1100,
    margin: "24px auto 0",
    color: MUTED,
    fontSize: 12,
    textAlign: "center",
  },
 
  newsletterRow: { display: "flex", gap: 8, marginTop: 12 },
  newsletterInput: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: TEXT,
    fontSize: 13,
    flex: 1,
    outline: "none",
  },
  newsletterBtn: {
    background: YELLOW,
    color: "#0b0f14",
    fontWeight: 700,
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    cursor: "pointer",
    fontSize: 15,
  },
};
 
// ── Page ────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={styles.page}>
      <Navbar />
      <Hero />
      <TrustedBy />
      <FeaturesSection />
      <GroupManagement />
      <ExpenseTracking />
      <PersonalExperience />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}