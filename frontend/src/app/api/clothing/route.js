import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        // Solicitamos los productos a la API de FakeStore
        const res = await fetch("https://fakestoreapi.com/products", {
            next: { revalidate: 3600 } // Caché de 1 hora
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Error al consultar la API de ropa" }, { status: res.status });
        }

        const products = await res.json();

        // Filtramos solo categorías relacionadas con moda / ropa / accesorios
        let fashionProducts = products.filter((item) =>
            ["men's clothing", "women's clothing", "jewelery"].includes(item.category)
        );

        // Si el cliente especifica una categoría, filtramos
        if (category && category !== "all") {
            fashionProducts = fashionProducts.filter((item) => item.category === category);
        }

        // Formateamos los datos para nuestra interfaz
        const catalogo = fashionProducts.map((item) => ({
            id: item.id,
            titulo: item.title,
            precio: item.price,
            descripcion: item.description,
            categoria: item.category,
            imagen: item.image,
            rating: item.rating?.rate || 4.5,
            reviewsCount: item.rating?.count || 120
        }));

        return NextResponse.json(catalogo);
    } catch (error) {
        console.error("Error en la API de ropa:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}