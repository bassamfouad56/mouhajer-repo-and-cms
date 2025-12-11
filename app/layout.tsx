import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Google Fonts as fallback
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

// Local Fonts - Satoshi for body, Schnyder for headers
const satoshi = localFont({
  src: "../public/fonts/Satoshi-Regular.ttf",
  variable: "--font-Satoshi",
  display: "swap",
});

const schnyder = localFont({
  src: "../public/fonts/SchnyderS-Ligh.otf",
  variable: "--font-SchnyderS",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com'),
  title: {
    default: "Mouhajer International Design | Luxury Interior Design Dubai",
    template: "%s | Mouhajer International Design",
  },
  description:
    "Award-winning interior design studio in Dubai, specializing in luxury residential and commercial spaces. Creating timeless, elegant interiors since 2009.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVariables = `${inter.variable} ${playfair.variable} ${cairo.variable} ${satoshi.variable} ${schnyder.variable}`;

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fontVariables} antialiased`}>
        {children}
      </body>
    </html>
  );
}
