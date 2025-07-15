import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProductById } from "@/lib/catalog";
import { Product } from "@/types/catalog";
import Image from "next/image";

interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  product?: Product;
}

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setError(null);
        // In a real app, you would fetch cart items from your backend
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        
        if (!Array.isArray(items) || items.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const itemsWithProducts = await Promise.all(
          items.map(async (item: CartItem) => {
            try {
              if (!item.productId) {
                console.warn("Cart item missing productId:", item);
                return { ...item, product: undefined };
              }
              const product = await getProductById(item.productId);
              return { ...item, product: product || undefined };
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              // Return item without product instead of failing completely
              return { ...item, product: undefined };
            }
          })
        );
        
        // Filter out items that couldn't be loaded
        const validItems = itemsWithProducts.filter(item => item.product !== undefined);
        setCartItems(validItems);
        
        // Update localStorage to remove invalid items
        if (validItems.length !== itemsWithProducts.length) {
          localStorage.setItem("cart", JSON.stringify(validItems));
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items. Please try again.");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const removeItem = (productId: string) => {
    const updatedItems = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex gap-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
              {item.product && (
                <>
                  <div className="relative w-24 h-24 flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Size: {item.size}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Color: {item.color}</p>
                    <p className="text-gray-900 dark:text-white font-medium">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold text-gray-900 dark:text-white">Total: ${total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 