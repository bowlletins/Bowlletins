import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import Providers from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-caveat", 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bow-lletins",
  description: "Final Project for ICS 312 Software Engineering, University of Hawaii at Manoa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const classString = `${geistSans.variable} ${geistMono.variable} ${caveat.variable} wrapper`;

  return (
    <html lang="en">
      <body className={classString}>
        <Providers>
          <NavBar />

          <div className="page-content flex-grow-1">
            {children}
          </div>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
