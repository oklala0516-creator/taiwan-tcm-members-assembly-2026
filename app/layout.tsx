import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://taiwan-tcm-assembly-2026.new-n1.chatgpt.site"),
  title: "2026 會員大會暨產業參訪｜台灣中藥權益促進會",
  description: "2026 年 9 月 19 日，台灣中藥權益促進會會員大會暨科達製藥產業參訪。從中藥材源頭管理、品質檢驗到產業共同倡議。",
  openGraph: { title: "守住每一味藥，連起產業的未來", description: "台灣中藥權益促進會｜2026 會員大會暨產業參訪", images: [{ url: "/og.png", width: 1680, height: 945 }] },
  twitter: { card: "summary_large_image", title: "2026 會員大會暨產業參訪", description: "台灣中藥權益促進會・2026.09.19", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
