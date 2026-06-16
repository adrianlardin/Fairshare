"use client";

import { Navbar } from "@/components/navbar"; // <-- Navbar corregido e importado desde tu carpeta de componentes
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

// ── Datos ───────────────────────────────────────────────────────────────────────
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
function Hero() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 pt-28 pb-16 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1">
        <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold leading-[1.1] tracking-[-1.5px] mb-5 text-slate-50">
          Finanzas, <span className="text-[#4ADE80]">sincronizadas.</span>
          <br />Amistades, a salvo.
        </h1>
        <p className="text-[#718096] text-base max-w-[460px] mb-8">
          La aplicación de gastos compartidos de alto rendimiento diseñada para equipos modernos,
          compañeros de piso y viajeros que valoran la precisión y la claridad.
        </p>
        <div className="flex items-center gap-5 flex-wrap">
          <a href="#" className="bg-[#F5C518] text-[#0b0f14] font-bold text-sm px-5 py-2.5 rounded-lg no-underline inline-block hover:opacity-90 transition-opacity">
            Empieza gratis →
          </a>
          <a href="#" className="text-[#e2e8f0] no-underline text-sm flex items-center gap-2 hover:text-white transition-colors">
            ▶ Ver Demo
          </a>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="flex-1 flex justify-center w-full">
        <div className="bg-gradient-to-br from-[#131a24] to-[#0f1923] border border-white/5 rounded-2xl p-5 w-full max-w-[440px] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="bg-[#0b0f14] rounded-lg p-4 min-h-[220px]">
            <div className="flex gap-1.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5C518] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] inline-block" />
            </div>
            {/* Fake chart bars */}
            <div className="flex items-end gap-1 h-[100px] mb-4">
              {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[3px] min-w-[8px]"
                  style={{
                    height: `${h}%`,
                    background: i === 10 ? "#4ADE80" : "rgba(74,222,128,0.3)",
                  }}
                />
              ))}
            </div>
            {/* Fake stat bubbles */}
            <div className="flex gap-3">
              {["$1,240", "$380", "$860"].map((v, i) => (
                <div key={i} className="bg-[#131a24] border border-white/5 rounded-lg p-2.5 flex-1 flex flex-col gap-0.5">
                  <span className="text-[#4ADE80] font-bold text-[15px]">{v}</span>
                  <span className="text-[#718096] text-[11px]">
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
    <div className="text-center px-6 py-10 border-t border-white/5">
      <p className="text-[#718096] text-[11px] tracking-[1.5px] mb-6">CON LA CONFIANZA DE STARTUPS Y EMPRESAS EN CRECIMIENTO EN TODO EL MUNDO</p>
      <div className="flex justify-center items-center gap-9 flex-wrap">
        {TRUSTED_BY.map((name) => (
          <span key={name} className="text-[#4a5568] font-bold text-sm tracking-[0.5px]">{name}</span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.8px] mb-3 text-slate-50">Precisión en cada transacción</h2>
      <p className="text-[#718096] text-sm max-w-[500px] mx-auto mb-12">
        Tres pilares que definen nuestro compromiso con tu claridad financiera.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
        {FEATURES_CARDS.map((f) => (
          <div key={f.title} className="bg-[#131a24] border border-white/5 rounded-xl p-6">
            <div className="text-2xl mb-3.5">{f.icon}</div>
            <h3 className="font-bold text-base mb-2 text-slate-50">{f.title}</h3>
            <p className="text-[#718096] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GroupManagement() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16 flex-wrap">
      <div className="flex-1 min-w-[280px]">
        <span className="text-[#4ADE80] text-[11px] font-bold tracking-[2px]">GESTIÓN DE GRUPOS</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.6px] mt-2.5 mb-4 text-slate-50">
          Coordínate sin esfuerzo<br />con cualquier grupo
        </h2>
        <p className="text-[#718096] text-sm mb-6 leading-relaxed">
          Ya sea el alquiler familiar, los gastos con compañeros de piso o una escapada de fin de
          semana con amigos. Gestiona múltiples círculos con libros de contabilidad específicos y reglas de división personalizadas.
        </p>
        <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
          {GROUP_BULLETS.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-[#e2e8f0] text-sm">
              <CheckIcon /> {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 min-w-[260px] flex justify-center">
        <PhoneMockup type="group" />
      </div>
    </section>
  );
}

function ExpenseTracking() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 flex flex-col md:flex-row-reverse items-center gap-16 flex-wrap bg-transparent">
      <div className="flex-1 min-w-[260px] flex justify-center">
        <PhoneMockup type="expense" />
      </div>
      <div className="flex-1 min-w-[280px]">
        <span className="text-[#4ADE80] text-[11px] font-bold tracking-[2px]">CONTROL DE GASTOS</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.6px] mt-2.5 mb-4 text-slate-50">
          Registra cada detalle en<br />segundos
        </h2>
        <p className="text-[#718096] text-sm mb-6 leading-relaxed">
          El registro manual es cosa del pasado. Escanea recibos, importa transacciones bancarias
          y realiza el seguimiento de facturas recurrentes con precisión milimétrica.
        </p>
        <div className="flex gap-3 flex-wrap">
          {EXPENSE_BADGES.map((b) => (
            <div key={b} className="bg-[#131a24] border border-white/5 rounded-lg px-4 py-2 text-sm text-[#e2e8f0] font-semibold">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonalExperience() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16 flex-wrap">
      <div className="flex-1 min-w-[280px]">
        <span className="text-[#4ADE80] text-[11px] font-bold tracking-[2px]">EXPERIENCIA PERSONALIZADA</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.6px] mt-2.5 mb-4 text-slate-50">
          Tus finanzas,<br />tus reglas
        </h2>
        <p className="text-[#718096] text-sm mb-6 leading-relaxed">
          Personaliza tu panel de control, configura alertas de presupuesto y gestiona tus preferencias
          de seguridad. SplitSync se adapta a tu estilo de vida financiero único.
        </p>
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[22px] bg-[#4ADE80] rounded-full p-0.5 flex items-center justify-end">
            <div className="w-[18px] h-[18px] bg-white rounded-full" />
          </div>
          <span className="text-sm text-[#e2e8f0]">Conectado con tu círculo social</span>
        </div>
      </div>
      <div className="flex-1 min-w-[260px] flex justify-center">
        <PhoneMockup type="personal" />
      </div>
    </section>
  );
}

function PhoneMockup({ type }) {
  const colors = { group: "#4ADE80", expense: "#F5C518", personal: "#818CF8" };
  const accent = colors[type] || "#4ADE80";
  return (
    <div 
      className="bg-[#131a24] border rounded-[20px] p-4 w-[220px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      style={{ borderColor: `${accent}30` }}
    >
      <div className="flex flex-col gap-2.5">
        <div className="h-1 rounded-sm w-[60%]" style={{ background: accent }} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: i === 1 ? accent : "#2d3748" }} />
            <div className="h-2 bg-[#1e2d3d] rounded-sm" style={{ width: `${60 + i * 8}%` }} />
          </div>
        ))}
        <div className="h-9 rounded-lg mt-2 opacity-90" style={{ background: accent }} />
      </div>
    </div>
  );
}

function Pricing() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.8px] mb-3 text-slate-50">Elige tu nivel de sincronización</h2>
      <p className="text-[#718096] text-sm max-w-[500px] mx-auto mb-12">Precios sencillos para todo el mundo.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left items-stretch">
        {PRICING.map((p) => (
          <div 
            key={p.tier} 
            className={`rounded-2xl p-7 flex flex-col gap-3 ${
              p.highlight 
                ? "bg-gradient-to-br from-[#131a24] to-[#162130] border border-[#4ADE80]/40 shadow-[0_0_30px_rgba(74,222,128,0.15)]" 
                : "bg-[#131a24] border border-white/5"
            }`}
          >
            {p.highlight && (
              <div className="bg-[#4ADE80]/20 text-[#4ADE80] text-[10px] font-bold tracking-[1.5px] px-2.5 py-1 rounded-md self-start">
                PLAN RECOMENDADO
              </div>
            )}
            <span className="text-[#718096] text-[11px] font-bold tracking-[1.5px]">{p.tier}</span>
            <div className="flex items-end gap-0.5">
              <span className="text-4xl sm:text-[40px] font-extrabold text-slate-50 tracking-[-1px] space-y-0 leading-none">{p.label}</span>
              {p.period && <span className="text-[#718096] text-sm pb-1">{p.period}</span>}
            </div>
            <p className="text-[#718096] text-[13px] m-0">{p.sub}</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5 flex-1 my-4">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#e2e8f0]">
                  <CheckIcon /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 px-5 rounded-lg font-semibold text-sm cursor-pointer mt-auto transition-opacity hover:opacity-90 ${
              p.highlight ? "bg-[#F5C518] text-[#0b0f14]" : "bg-transparent text-[#e2e8f0] border border-white/5"
            }`}>
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
    <section className="bg-[#111720] border-t border-b border-white/5 text-center py-20 px-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.8px] mb-3 text-slate-50">¿Listo para simplificar tu vida compartida?</h2>
      <p className="text-[#718096] text-sm max-w-[500px] mx-auto mb-7">
        Únete a los 519,371 usuarios que ya han alcanzado la claridad financiera y
        comparten gastos sin estrés.
      </p>
      <a href="#" className="bg-[#F5C518] text-[#0b0f14] font-bold text-sm px-5 py-2.5 rounded-lg no-underline inline-block hover:opacity-90 transition-opacity">
        Empieza gratis →
      </a>
      <p className="text-[#718096] text-xs mt-3.5">Sin tarjeta de crédito · Cancela cuando quieras</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#080c10] px-6 pt-16 pb-6 border-t border-white/5">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] bg-[#4ADE80]/20 rounded-full flex items-center justify-center">
              <span className="w-2.5 h-[1.5px] bg-[#4ADE80] rounded-sm transform translate-y-[1px]" />
            </div>
            <span className="font-bold text-lg text-white">SplitSync</span>
          </div>
          <p className="text-[#718096] text-[13px] mt-2.5 leading-relaxed">
            Claridad financiera precisa para equipos modernos.
          </p>
        </div>
        {Object.entries(FOOTER_COLS).map(([col, links]) => (
          <div key={col}>
            <p className="text-[#e2e8f0] font-bold text-xs tracking-[1.2px] mb-4 mt-0">{col.toUpperCase()}</p>
            <ul className="list-none p-0 m-0">
              {links.map((l) => (
                <li key={l} className="mb-2">
                  <a href="#" className="text-[#718096] no-underline text-[13px] hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-[#e2e8f0] font-bold text-xs tracking-[1.2px] mb-4 mt-0">BOLETÍN INFORMATIVO</p>
          <p className="text-[#718096] text-[13px] leading-relaxed">Recibe los últimos consejos sobre gestión de gastos.</p>
          <div className="flex gap-2 mt-3">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="bg-[#131a24] border border-white/5 rounded-lg py-2.5 px-3 text-[#e2e8f0] text-[13px] flex-1 outline-none focus:border-white/20 transition-colors"
            />
            <button className="bg-[#F5C518] text-[#0b0f14] font-bold border-none rounded-lg py-2.5 px-3.5 cursor-pointer text-[15px] hover:opacity-90 transition-opacity">
              →
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto mt-6 text-[#718096] text-xs text-center">
        <span>© 2026 SplitSync. Claridad financiera precisa para equipos modernos. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-[#171717] text-[#e2e8f0] font-sans min-h-screen leading-relaxed">
      <Navbar /> {/* <-- Renderiza limpiamente el componente global importado arriba */}
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