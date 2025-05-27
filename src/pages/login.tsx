// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import { FormEvent } from "react"; // Explicitly import FormEvent

// export default function Login() {
//   const router = useRouter();

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget; // More reliable than e.target
//     const email = form.email.value; // Direct access via name
//     const password = form.password.value;

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push("/");
//     } catch (error) {
//       alert(error instanceof Error ? error.message : "Login failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="email" name="email" placeholder="Email" required />
//       <input type="password" name="password" placeholder="Password" required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }
import LoginForm from "@/components/auth/LoginForm";
import SocialAuth from "@/components/auth/SocialAuth";
import Link from "next/link";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function LoginPage() {
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
          </nav>
        </div>
      </header>

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
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SROW Clothing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}