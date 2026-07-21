import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Consultamos CoinPaprika (API pública y muy estable)
        const res = await fetch("https://api.coinpaprika.com/v1/news/latest", {
            next: { revalidate: 600 }
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Error al obtener noticias" }, { status: res.status });
        }

        const data = await res.json();

        // Mapeamos las noticias devueltas
        const noticiasFormateadas = (Array.isArray(data) ? data : []).slice(0, 8).map((item) => ({
            title: item.title,
            description: item.lead || item.description || "Haz clic para leer la noticia completa sobre criptomonedas e inversión.",
            url: item.url,
            src: item.source_name || "Crypto News"
        }));

        return NextResponse.json(noticiasFormateadas);
    } catch (error) {
        return NextResponse.json({ error: "Error de servidor al consultar noticias" }, { status: 500 });
    }
}