"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/router";
import { getProductById, updateProduct, getAllCategories, uploadProductImage } from "@/lib/catalog";
import { Category, Product } from "@/types/catalog";
import { protectAdminRoute } from "@/lib/auth.server";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";

export default function EditProductPage({ productId }: { productId: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
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
  });  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        
        // Explicitly type the product as Product to use the imported type
        const product: Product | null = await getProductById(productId);
        if (!product) {
          setError("Product not found");
          return;
        }
        
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice || 0,
          stock: product.stock,
          sku: product.sku || "",
          featured: product.featured,
          slug: product.slug,
          categoryIds: product.categoryIds,
        });
        
        setExistingImages(product.images || []);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

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
  
  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (formData.categoryIds.length === 0) {
      setError("Please select at least one category for this product.");
      setSaving(false);
      return;
    }
    
    try {
      // Upload new images if any
      const uploadPromises = selectedFiles.map(file => 
        uploadProductImage(file, productId)
      );
      
      const newImageUrls = await Promise.all(uploadPromises);
      
      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];
      
      // Update the product
      await updateProduct(productId, {
        ...formData,
        images: allImages,
      });
      
      setSaving(false);
      router.push("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading product...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !loading) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push("/admin/products")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Back to Products
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
        
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
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Current Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">                  {existingImages.map((url, index) => (
                    <div key={index} className="relative w-full h-32">
                      <Image
                        src={url}
                        alt={`Product ${index}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover rounded"
                        priority={index < 2} // Prioritize loading the first two images
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Add New Images</label>
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
                <label className="block text-sm font-medium mb-1 text-gray-700">New Image Previews</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filePreviewUrls.map((url, index) => (
                    <div key={index} className="relative w-full h-32">
                      <Image
                        src={url}
                        alt={`Preview ${index}`}
                        fill
                        unoptimized
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
              disabled={saving}
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context;
  const productId = params?.id as string;
  
  const authResult = await protectAdminRoute(context);
  
  if ('redirect' in authResult) {
    return authResult;
  }
  
  return {
    props: {
      ...authResult.props,
      productId,
    },
  };
};
