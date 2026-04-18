import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Camera UI - SOC度量平台",
  description: "SOC Camera度量与任务调度管理平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 ml-60 flex flex-col">
            <Header />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
