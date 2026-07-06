import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "./context/ModalContext";
import { GlobalModales } from "../components/GlobalModales";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fairshare",
  description: "Divide tus gastos de forma justa",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="m-0 p-0 text-white bg-gray-900">
          <ModalProvider>
            {/* 2. El modal se renderiza aquí de fondo esperando que el contexto se active */}
            <GlobalModales /> 
            
            <main className="w-full min-h-screen">
              {children}
            </main>
          </ModalProvider>
      </body>
    </html>
  );
}