// pages/admin/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAllProducts, getAllCategories } from "@/lib/catalog";
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { useCallback } from 'react';
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { protectAdminRoute } from '@/lib/auth.server';

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome, Admin!</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">Logged in as: <span className="font-mono">{adminEmail}</span></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
          <Link href="/admin/categories" className="block bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg p-6 text-center shadow transition">
            <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-200">Manage Categories</h2>
            <p className="text-gray-600 dark:text-gray-300">View, add, edit, or delete product categories.</p>
          </Link>
          <Link href="/admin/products" className="block bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg p-6 text-center shadow transition">
            <h2 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-200">Manage Products</h2>
            <p className="text-gray-600 dark:text-gray-300">View, add, edit, or delete products.</p>
          </Link>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push('/admin/profile')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Profile</button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResult = await protectAdminRoute(ctx);

  if ('redirect' in authResult) {
    return authResult;
  }

  // We need to get the email to display it, so we'll verify the token again here.
  // This is slightly redundant but necessary to get user details on this page.
  // A more advanced implementation might pass the decoded token through props.
  try {
    const cookies = nookies.get(ctx);
    const decoded = await firebaseAdmin.auth().verifyIdToken(cookies.admin_token);
    return { 
      props: { 
        adminEmail: decoded.email || 'Admin',
      } 
    };
  } catch (error) {
    // If token is invalid, redirect to login
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};