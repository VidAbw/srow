import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Product } from "@/types/catalog";
import { getAllProducts, deleteProduct } from "@/lib/catalog";
import Link from "next/link";
import Image from "next/image";
import { protectAdminRoute } from "@/lib/auth";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
      } catch (err) {
        setError("Failed to delete product");
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Products</h2>
          <Link
            href="/admin/products/new"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add New Product
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-4">Loading products...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center py-4">No products found. Add your first product!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Image</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">Stock</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">                    <td className="py-2 px-4 border-b">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative h-10 w-10">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover rounded"
                            priority={false}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{product.name}</td>
                    <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{product.stock}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = protectAdminRoute;
