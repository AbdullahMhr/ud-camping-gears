import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QuickContact from "./components/QuickContact";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import { ProductProvider } from "../context/ProductContext";

import { AuthProvider } from "../context/AuthContext";

import { GalleryProvider } from "../context/GalleryContext";

export const viewport: Viewport = {
  themeColor: "#0b3c2e",
};

export const metadata: Metadata = {
  title: "UD Camping Gears",
  description: "Premium camping gears for your adventure.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UD Camping",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased text-gray-900 bg-white`}>
        <AuthProvider>
          <GalleryProvider>
            <ProductProvider>
              <CartProvider>
                <ToastProvider>
                  <Header />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <QuickContact />
                </ToastProvider>
              </CartProvider>
            </ProductProvider>
          </GalleryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
