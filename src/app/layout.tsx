import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "NeuroDeck",
  description: "Flashcard learning app with AI-powered flashcards",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "48x48", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-gray-100 text-gray-900 min-h-screen antialiased",
          inter.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
