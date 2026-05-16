import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "SmoothSale",
  description: "AI-powered sales copilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <Sidebar />
        <main className="ml-[220px] min-h-screen">{children}</main>
      </body>
    </html>
  );
}
