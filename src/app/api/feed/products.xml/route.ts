import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  // Fetch products from API
  const products = await getProducts();
  
  // Generate RSS/XML feed for product discovery
  const items = products.map((product) => `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${product.description}]]></g:description>
      <g:link>${baseUrl}/product/${product.id}</g:link>
      <g:image_link>${product.image || baseUrl + '/placeholder.jpg'}</g:image_link>
      <g:price>${product.price} USD</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Sonora Threads</g:brand>
      <g:product_type>${product.category || 'Apparel &amp; Accessories'}</g:product_type>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Sonora Threads Product Feed</title>
    <link>${baseUrl}</link>
    <description>Voice-native shopping for Sonora Threads with real product data</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
