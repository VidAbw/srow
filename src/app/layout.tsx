import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css"; // Assuming your global styles are here
import AuthProvider from "@/components/auth/AuthProvider";

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
