import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./dashboard.css";
import "./public-brain.css";
import "./share-controls.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brain Dock — Remember what matters.",
  description:
    "Brain Dock is a calm place for your links, notes, ideas, and YouTube videos. Save anything, organize it automatically, and ask questions against your own saved knowledge.",
  keywords: [
    "knowledge management",
    "notes app",
    "bookmark manager",
    "personal wiki",
    "AI search",
    "productivity",
  ],
  authors: [{ name: "Brain Dock" }],
  creator: "Brain Dock",
  metadataBase: new URL("https://braindock.visheshxdevs.in"),
  openGraph: {
    title: "Brain Dock — Remember what matters.",
    description:
      "Save links, notes, ideas, and videos. Organize them automatically. Ask questions and get answers grounded in what you've saved.",
    url: "https://braindock.visheshxdevs.in",
    siteName: "Brain Dock",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Dock — Remember what matters.",
    description:
      "Save links, notes, ideas, and videos. Organize them automatically. Ask questions and get answers grounded in what you've saved.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
