import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Media Downloader Pro - Download Video & Audio dari YouTube, TikTok, Instagram",
  description: "Download video, audio, dan foto dari YouTube, TikTok, dan Instagram dengan mudah dan cepat. Support berbagai format kualitas tinggi.",
  keywords: ["YouTube downloader", "TikTok downloader", "Instagram downloader", "video download", "audio download", "media downloader"],
  authors: [{ name: "Media Downloader Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Media Downloader Pro",
    description: "Download video, audio, dan foto dari YouTube, TikTok, dan Instagram dengan mudah",
    url: "https://chat.z.ai",
    siteName: "Media Downloader Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Downloader Pro",
    description: "Download video, audio, dan foto dari YouTube, TikTok, dan Instagram dengan mudah",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
