import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/router";

interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: string;
  createdAt: Date;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        setError(null);
        // In a real app, you would fetch orders from your backend
        // For now, we'll simulate some orders
        const mockOrders: Order[] = [
          {
            id: "1",
            items: [
              { productId: "1", name: "Sample Product", price: 29.99, quantity: 2 }
            ],
            total: 59.98,
            status: "Delivered",
            createdAt: new Date("2024-01-15")
          }
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h1>
      
      {/* User Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">User Information</h2>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">User ID:</span> {user.uid}
          </p>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order History</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <p className="text-gray-700 dark:text-gray-300">{item.name} x {item.quantity}</p>
                      <p className="text-gray-900 dark:text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                  <p className="font-bold text-gray-900 dark:text-white">Total: ${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 