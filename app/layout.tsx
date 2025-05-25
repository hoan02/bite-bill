import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bite Bill - Quản lý hóa đơn & thanh toán tiện lợi",
  description:
    "Bite Bill giúp bạn theo dõi, chia sẻ và thanh toán hóa đơn một cách dễ dàng. Trải nghiệm quản lý tài chính minh bạch và thông minh, mọi lúc mọi nơi.",
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
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
