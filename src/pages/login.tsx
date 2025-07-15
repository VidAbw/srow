import LoginForm from "@/components/auth/LoginForm";
import SocialAuth from "@/components/auth/SocialAuth";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function LoginPage() {
  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900`}>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Login to SROW</h1>
          <LoginForm />
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <SocialAuth />
        </div>
      </div>
    </div>
  );
}