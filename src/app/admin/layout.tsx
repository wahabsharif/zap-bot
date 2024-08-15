import SideBar from "@/components/admin/SideBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} flex`}>
      <SideBar />
      <main className="ml-60 flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  );
}
