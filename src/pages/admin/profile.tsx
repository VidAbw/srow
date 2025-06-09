import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

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
    return { props: { adminEmail: decoded.email } };
  } catch (e) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};

export default function AdminProfile({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Admin Profile</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">Email: <span className="font-mono">{adminEmail}</span></p>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
    </div>
  );
} 