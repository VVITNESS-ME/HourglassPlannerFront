import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar/navbar";
import localFont from "next/font/local";

const mango = localFont({
  src: "../../public/fonts/MangoDdobak-B.ttf",
  display: "swap",
  variable: "--font-mango",
});

export const metadata: Metadata = {
  title: "모래시계 플래너",
  description: "Change your life",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
    <body className={mango.className}>
    <Navbar />
    <div className="pt-10 flex flex-col">
      {children}
    </div>
    </body>
    </html>
  );
}
