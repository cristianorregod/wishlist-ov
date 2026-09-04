import type { Metadata } from "next";
import { Quicksand, Work_Sans } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nuestra Lista",
  description: "La lista de deseos de la familia",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${quicksand.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
