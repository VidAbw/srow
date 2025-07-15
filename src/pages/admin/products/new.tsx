"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { createProduct, uploadProductImage, updateProduct, getAllCategories } from "@/lib/catalog";
import { useRouter } from "next/router";
import { Category } from "@/types/catalog";
import { protectAdminRoute } from "@/lib/auth.server";
import Image from "next/image";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    stock: 0,
    sku: "",
    featured: false,
    slug: "",
    categoryIds: [] as string[],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, categoryIds: selectedOptions }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      // Create preview URLs for the selected files
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setFilePreviewUrls(previewUrls);
    }
  };
  
  // Generate slug from product name
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
    
    if (formData.categoryIds.length === 0) {
      setError("Please select at least one category for this product.");
      setLoading(false);
      return;
    }

    try {
      // First create the product
      const productId = await createProduct({
        ...formData,
        images: [],
      });
      
      // Then upload the images if any
      const uploadPromises = selectedFiles.map(file => 
        uploadProductImage(file, productId)
      );
      
      const imageUrls = await Promise.all(uploadPromises);
      
      // Update the product with the image URLs
      if (imageUrls.length > 0) {
        await updateProduct(productId, { images: imageUrls });
      }
      
      setLoading(false);
      router.push("/admin/products");
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product");
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Add New Product</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleNameBlur}
                required
                className="w-full p-2 border rounded bg-white text-gray-900"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-32 bg-white text-gray-900"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full p-2 pl-7 border rounded bg-white text-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Compare At Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="compareAtPrice"
                  value={formData.compareAtPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-2 pl-7 border rounded bg-white text-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full p-2 border rounded bg-white text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-white text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded bg-white text-gray-900"
              />
            </div>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                  Featured Product
                </label>
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Categories</label>
              <select
                multiple
                name="categoryIds"
                value={formData.categoryIds}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded h-32 bg-white text-gray-900"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {filePreviewUrls.length > 0 && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Image Previews</label>
                <div className="grid grid-cols-3 gap-4">
                  {filePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index}`}
                        width={300}
                        height={128}
                        style={{ height: 'auto' }}
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
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
              {loading ? "Creating..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
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
