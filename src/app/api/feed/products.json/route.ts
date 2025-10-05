import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  // Fetch products from API
  const products = await getProducts();
  
  // Transform products to ACP Product Feed Spec format
  const feed = products.map((product) => ({
    id: product.id,
    title: product.name,
    description: product.description,
    link: `${baseUrl}/product/${product.id}`,
    price: `${product.price} USD`,
    availability: "in stock",
    condition: "new",
    brand: "Sonora Threads",
    image_link: product.image || `${baseUrl}/placeholder-${product.id}.jpg`,
    product_type: product.category || "Apparel & Accessories",
    google_product_category: "Apparel & Accessories",
    rating: product.rating,
  }));

  return NextResponse.json({
    version: "1.0",
    merchant: {
      name: "Sonora Threads",
      domain: baseUrl,
    },
    products: feed,
    last_updated: new Date().toISOString(),
  });
}
