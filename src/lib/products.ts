export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// Cache for products
let cachedProducts: Product[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProducts(): Promise<Product[]> {
  // Return cached products if still valid
  if (cachedProducts && Date.now() - lastFetch < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    // Fetch from FakeStore API (free, no auth needed)
    const response = await fetch("https://fakestoreapi.com/products/category/men's clothing");
    
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    
    // Transform to our Product format
    cachedProducts = data.map((item: any) => ({
      id: String(item.id),
      name: item.title,
      price: Math.round(item.price), // Round to whole dollars
      description: item.description,
      image: item.image,
      category: item.category,
      rating: item.rating,
    }));

    lastFetch = Date.now();
    return cachedProducts || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Fallback to static products if API fails
    return [
      {
        id: "1",
        name: "Soft Black Hoodie",
        price: 32,
        description: "Comfortable black hoodie",
        image: "/placeholder.jpg",
      },
      {
        id: "2",
        name: "Warm Beanie",
        price: 15,
        description: "Cozy winter beanie",
        image: "/placeholder.jpg",
      },
      {
        id: "3",
        name: "Classic White Tee",
        price: 25,
        description: "Classic white t-shirt",
        image: "/placeholder.jpg",
      },
      {
        id: "4",
        name: "Denim Jacket",
        price: 89,
        description: "Stylish denim jacket",
        image: "/placeholder.jpg",
      },
      {
        id: "5",
        name: "Cozy Socks",
        price: 12,
        description: "Warm and comfortable socks",
        image: "/placeholder.jpg",
      },
    ];
  }
}

// Synchronous access for backward compatibility
export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Soft Black Hoodie",
    price: 32,
    description: "Comfortable black hoodie",
  },
  {
    id: "2",
    name: "Warm Beanie",
    price: 15,
    description: "Cozy winter beanie",
  },
  {
    id: "3",
    name: "Classic White Tee",
    price: 25,
    description: "Classic white t-shirt",
  },
  {
    id: "4",
    name: "Denim Jacket",
    price: 89,
    description: "Stylish denim jacket",
  },
  {
    id: "5",
    name: "Cozy Socks",
    price: 12,
    description: "Warm and comfortable socks",
  },
];

export function findProduct(name: string, products: Product[]): Product | undefined {
  const normalized = name.toLowerCase();
  return products.find((p) => p.name.toLowerCase().includes(normalized));
}
