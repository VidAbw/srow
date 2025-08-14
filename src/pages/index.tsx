import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/catalog";
import { Product } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900`}>
      
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

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {product.images.length > 0 && (
                  <div className="relative h-64 bg-gray-200">
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}