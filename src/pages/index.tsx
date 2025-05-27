import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900`}>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SROW
            </h1>
          </Link>
          <nav className="flex gap-6">
            <Link href="/shop" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Shop
            </Link>
            <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Login
            </Link>
          </nav>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SROW Clothing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}