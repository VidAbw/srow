import { emailLogin } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await emailLogin(email, password);
      router.push("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input 
          id="email"
          name="email" 
          type="email" 
          placeholder="Enter your email" 
          required 
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input 
          id="password"
          name="password" 
          type="password" 
          placeholder="Enter your password" 
          required 
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <button 
          type="submit" 
          className="w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-gray-900"
        >
          Sign in
        </button>
      </div>
      
      <div className="text-center">
        <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          Forgot your password?
        </a>
      </div>
    </form>
  );
}