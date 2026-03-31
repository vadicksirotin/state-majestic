import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export const metadata: Metadata = {
  title: "State Majestic — Портал государственных структур",
  description: "Единый портал всех государственных структур штата San Andreas. Правительство, LSPD, EMS, Sheriff, FIB, USSS, SANG.",
  keywords: "State Majestic, Majestic RP, государственные структуры, GTA RP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <LoadingScreen />
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
