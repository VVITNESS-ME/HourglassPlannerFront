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

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="ko">
    <body className={mango.className}>
    <div className="bg-transparent w-screen h-screen -z-50">
    <Navbar />
    <div className="">
      {children}
    </div>
    </div>
    </body>
    </html>
  );
}
