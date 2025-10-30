import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Barbearia Dashboard",
  description: "Sistema de gestão para barbearia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={poppins.className}>
      <body>
        <div className="w-screen overflow-x-hidden h-screen">
          <Toaster />
          <main className="w-full h-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
