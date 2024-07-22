import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar/navbar";
import localFont from "next/font/local";

const mango = localFont({
  src: "../../public/fonts/PretendardVariable.ttf",
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
      <body className={mango.className }>
        <div className="bg-wallpaper w-screen dynamic-height -z-50">
          <Navbar />
          <div className="flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
