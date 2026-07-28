import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mock CBT | SBI PO Preliminary Online Exam Platform',
  description: 'Secure, mobile-first Computer Based Test (CBT) platform for SBI PO Preliminary mock exam practice, locked answer enforcement, and candidate growth tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
