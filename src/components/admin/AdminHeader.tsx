"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user's email
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <span className="text-sm text-gray-500">Visit Site</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <span className="text-sm font-medium">{userEmail || "Admin"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`h-4 w-4 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 px-4 py-2 overflow-x-auto">
        <Link
          href="/admin"
          className={`text-sm px-2 py-1 rounded-md ${
            router.pathname === "/admin"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/categories"
          className={`text-sm px-2 py-1 rounded-md ${
            router.pathname.startsWith("/admin/categories")
              ? "bg-blue-100 text-black"
              : "text-black hover:text-gray-800"
          }`}
        >
          Categories
        </Link>
        <Link
          href="/admin/products"
          className={`text-sm px-2 py-1 rounded-md ${
            router.pathname.startsWith("/admin/products")
              ? "bg-blue-100 text-black"
              : "text-black hover:text-gray-800"
          }`}
        >
          Products
        </Link>
      </div>
    </div>
  );
}
