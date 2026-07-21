import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Consultamos la API oficial de Frankfurter para la base EUR
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY,CHF,CAD,AUD", {
      next: { revalidate: 3600 } // Caché de 1 hora
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Error al consultar divisas" }, { status: res.status });
    }

    const data = await res.json();
    const rates = data.rates || {};

    // Formateamos los pares de divisas más populares
    const divisas = [
      { simbolo: "USD", nombre: "Dólar Estadounidense", flag: "🇺🇸", valor: rates.USD || 1.08 },
      { simbolo: "GBP", nombre: "Libra Esterlina", flag: "🇬🇧", valor: rates.GBP || 0.85 },
      { simbolo: "JPY", nombre: "Yen Japonés", flag: "🇯🇵", valor: rates.JPY || 165.2 },
      { simbolo: "CHF", nombre: "Franco Suizo", flag: "🇨🇭", valor: rates.CHF || 0.96 },
      { simbolo: "CAD", nombre: "Dólar Canadiense", flag: "🇨🇦", valor: rates.CAD || 1.48 },
      { simbolo: "AUD", nombre: "Dólar Australiano", flag: "🇦🇺", valor: rates.AUD || 1.62 }
    ];

    return NextResponse.json({
      fecha: data.date,
      divisas
    });
  } catch (error) {
    console.error("Error en API de divisas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}