import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thaisafelix.com.br'),
  title: "Thaísa Felix | Nutricionista - Saúde, Constância e Zero Paranoia",
  description: "Atendimento nutricional presencial em Campo Grande (Rio de Janeiro) e online para todo o Brasil. Reeducação alimentar, planos personalizados e acompanhamento humanizado.",
  keywords: [
    "nutricionista", 
    "Thaísa Felix", 
    "nutricionista Campo Grande RJ", 
    "nutrição online", 
    "emagrecimento saudável", 
    "calculadora IMC", 
    "reeducação alimentar"
  ],
  authors: [{ name: "Thaísa Felix" }],
  openGraph: {
    title: "Thaísa Felix | Nutricionista",
    description: "Aqui a transformação acontece com saúde, constância e zero paranoia. Atendimento presencial e online.",
    images: ["/images/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#E87722] selection:text-white">
        {children}
      </body>
    </html>
  );
}
