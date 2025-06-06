import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css"; // Assuming your global styles are here
import AuthProvider from "@/components/auth/AuthProvider";
import AuthTokenHandler from "@/components/auth/AuthTokenHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SROW",
  description: "SROW Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthTokenHandler>
            {children}
          </AuthTokenHandler>
        </AuthProvider>
      </body>
    </html>
  );
}
