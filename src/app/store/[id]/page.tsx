"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Volume2, Plus, Minus, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const { id: storeId } = use(params);

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, [storeId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?storeId=${storeId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`cart_${storeId}`);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart_${storeId}`, JSON.stringify(newCart));
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { productId: product.id, quantity, product }];
      }
      
      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const newCart = prevCart
        .map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
        .filter(item => item.quantity > 0);
      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.productId !== productId);
      saveCart(newCart);
      return newCart;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleVoiceCommand = (command: string) => {
    // Handle voice commands like add to cart, checkout, etc.
    console.log('Voice command:', command);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/agentic/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) throw new Error('Checkout failed');

      const data = await response.json();
      
      // Redirect to checkout result page
      window.location.href = `/checkout/result?orderId=${data.orderId}`;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Volume2 className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Demo Store</h1>
              </div>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Products</h2>
              <p className="text-gray-600">Browse with voice or click to add to cart</p>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No products available yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingCart className="w-16 h-16 text-gray-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                      {!product.inStock && (
                        <p className="text-sm text-red-600 mt-2">Out of stock</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sonora Agent & Cart */}
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-3">
                <Volume2 className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-blue-900">Talk to Sonora</h3>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Click the floating Sonora button to shop with voice! Just say what you're looking for.
              </p>
              <div className="bg-white rounded-lg p-3 text-xs text-gray-600">
                Try: "Find me a hoodie" or "Add this to my cart"
              </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Cart ({cartItemCount})</h3>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-600">${item.product.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded ml-1"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                  >
                    Checkout with ACP
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Powered by OpenAI Agentic Commerce
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
