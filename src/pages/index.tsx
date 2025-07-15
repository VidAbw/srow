import { useEffect, useState } from "react";
import { getAllCategories, getAllProducts } from "@/lib/catalog";
import { Category, Product } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getAllCategories(),
          getAllProducts()
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900`}>
      {/* Temu-style Category Dropdown */}
      <div className="w-full bg-white py-3 flex justify-center relative z-20 border-b border-gray-200">
        <button
          className="text-gray-900 font-semibold px-6 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setShowCategoryDropdown((v) => !v)}
        >
          Categories
          <span className="ml-2">▼</span>
        </button>
        {showCategoryDropdown && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg w-80 max-h-96 overflow-y-auto border border-gray-200">
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-black"
                    onClick={() => setShowCategoryDropdown(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Your Style at SROW
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Premium clothing with Japanese and Sri Lankan influences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>        {/* Featured Image */}
        <div className="mt-16">
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
            <Image
              src="/logos/Logo.png"
              alt="SROW Clothing Collection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </main>

      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our Store</h1>
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <p className="text-sm text-gray-500 mb-2">Click a category to view all products in it.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id}>
              <div className="border p-4 rounded hover:bg-gray-100">
                <h3 className="font-bold">{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-semibold mb-2">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="border p-4 rounded hover:bg-gray-100">
                {product.images.length > 0 && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover mb-2" />
                )}
                <h3 className="font-bold">{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}