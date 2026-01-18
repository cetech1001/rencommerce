import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderWrapper, Footer } from "@/lib/components/server";
import { CartProvider, ToastProvider } from "@/lib/contexts";
import { config } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${config.app.name} - Rent or Buy Renewable Energy Equipment`,
  description: "Rent or buy premium renewable energy equipment including solar panels, wind turbines, battery storage, and more. Start your sustainability journey with EnergyHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <HeaderWrapper />
            {children}
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
