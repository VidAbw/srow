import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Category } from "@/types/catalog";
import { getAllCategories, deleteCategory } from "@/lib/catalog";
import Link from "next/link";
import Image from "next/image";
import { protectAdminRoute } from "@/lib/auth";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (err) {
        setError("Failed to delete category");
        console.error("Error deleting category:", err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Link
            href="/admin/categories/new"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add New Category
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-4">Loading categories...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center py-4">No categories found. Add your first category!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Image</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Description</th>
                  <th className="py-2 px-4 border-b text-left">Slug</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">                    <td className="py-2 px-4 border-b">
                      {category.imageUrl ? (
                        <div className="relative h-10 w-10">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            sizes="40px"
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{category.name}</td>
                    <td className="py-2 px-4 border-b">{category.description || "-"}</td>
                    <td className="py-2 px-4 border-b">{category.slug}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/categories/edit/${category.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
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
