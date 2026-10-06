import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/app/components/ui/ToastProvider";
import Sidebar from "@/app/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Cert-Hub",
    template: "%s | Cert-Hub",
  },
  description:
    "Manage and create certification practice modules and questions. Ideal for Linux, Cloud, and IT certification prep.",
  keywords: [
    "certification",
    "practice",
    "LPIC",
    "Linux",
    "CompTIA",
    "questions",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} font-sans bg-[#f5f5f5] text-gray-900 min-h-screen antialiased flex overflow-hidden`}
      >
        <ToastProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f5f5] relative">
            <div className="flex-1 overflow-y-auto p-8">
              {children}
            </div>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
