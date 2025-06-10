// pages/admin/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAllProducts, getAllCategories } from "@/lib/catalog";
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { useCallback } from 'react';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome, Admin!</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">Logged in as: <span className="font-mono">{adminEmail}</span></p>
      <div className="flex gap-4">
        <button onClick={() => router.push('/admin/profile')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Profile</button>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.admin_token;
  if (!token) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    // You can add more admin checks here if needed
    return { props: { adminEmail: decoded.email } };
  } catch  {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};