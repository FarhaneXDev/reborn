import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Reborn — Se reconstruire un jour à la fois",
  description: "Espace personnel, intime et bienveillant pour se reconstruire pas à pas après une rupture.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#DEECE2] selection:text-[#272522]">
        {children}
      </body>
    </html>
  );
}
