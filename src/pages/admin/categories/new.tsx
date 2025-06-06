"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { createCategory } from "@/lib/catalog";
import { useRouter } from "next/router";
import { protectAdminRoute } from "@/lib/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    parentId: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setFilePreviewUrl(previewUrl);
    }
  };
  
  // Generate slug from category name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };
  
  const handleNameBlur = () => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let imageUrl = undefined;
      
      // Upload image if selected
      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const storageRef = ref(storage, `categories/${fileName}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      
      // Create the category with imageUrl if available
      await createCategory({
        ...formData,
        imageUrl,
        slug: formData.slug || generateSlug(formData.name),
      });
      
      router.push("/admin/categories");
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Add New Category</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleNameBlur}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-32"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The URL-friendly version of the name. Will be auto-generated if left empty.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Parent Category (Optional)</label>
              <input
                type="text"
                name="parentId"
                value={formData.parentId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Parent category ID (if applicable)"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {filePreviewUrl && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Image Preview</label>                <Image
                  src={filePreviewUrl}
                  alt="Category preview"
                  width={128}
                  height={128}
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/categories")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = protectAdminRoute;
