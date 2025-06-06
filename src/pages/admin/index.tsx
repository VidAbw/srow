// pages/admin/index.tsx
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAllProducts, getAllCategories } from "@/lib/catalog";
import Link from "next/link";
import { protectAdminRoute } from "@/lib/auth";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and categories in parallel
        const [products, categories] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        
        setProductCount(products.length);
        setCategoryCount(categories.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Catalog Summary</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="text-2xl font-bold">{productCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Categories:</span>
                <span className="text-2xl font-bold">{categoryCount}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link 
                  href="/admin/products"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View all products →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              href="/admin/products/new"
              className="block py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded text-center"
            >
              Add New Product
            </Link>
            <Link 
              href="/admin/categories/new"
              className="block py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded text-center"
            >
              Add New Category
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Help & Resources</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://firebase.google.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Firebase Documentation
              </a>
            </li>
            <li>
              <a 
                href="https://nextjs.org/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Next.js Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = protectAdminRoute;