import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SHISHA LUX — Enjoy the Lux Moment", description: "Cachimbas, cócteles, gastronomía, terrazas y salas VIP en Rivas-Vaciamadrid." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}