import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SideBar from "@/components/admin/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="">
          <SideBar />
          {children}
        </main>
      </body>
    </html>
  );
}
