import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LossGuard AI | Auditoria de Delivery & Conciliação Financeira",
  description: "Plataforma de auditoria financeira, automação de contestações e inteligência operacional para restaurantes e marketplaces de delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 font-sans">{children}</body>
    </html>
  );
}
