import React, { useEffect, useState } from 'react';
import { getAllCategories, getAllProducts, getProductsByCategory } from '@/lib/catalog';
import { Category, Product } from '@/types/catalog';
import Link from 'next/link';
import Image from 'next/image';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

interface ShopProps {}

const Shop: React.FC<ShopProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          getAllCategories(),
          getAllProducts()
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products by category
  const handleCategoryFilter = async (categoryId: string | null) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      
      if (categoryId === null) {
        // Show all products
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } else {
        // Show products from selected category
        const categoryProducts = await getProductsByCategory(categoryId);
        setProducts(categoryProducts);
      }
    } catch (err) {
      console.error('Error filtering products:', err);
      setError('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name 
    : null;

  if (error) {
    return (
      <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900`}>
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Shop</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our premium collection of clothing
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {/* All Products Option */}
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === null
                      ? 'bg-black text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All Products
                </button>
                
                {/* Category Options */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:w-3/4">
            {/* Current Filter Display */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategoryName ? selectedCategoryName : 'All Products'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id} className="group">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Product Image */}
                        {product.images && product.images.length > 0 ? (
                          <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        
                        {/* Product Details */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              ${product.price}
                            </span>
                            {product.stock && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                product.stock > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : product.stock > 0 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18H4V8l6-4.5L16 8v10h-6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-400">
                      {selectedCategoryName 
                        ? `No products available in "${selectedCategoryName}" category.`
                        : 'No products available at the moment.'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
