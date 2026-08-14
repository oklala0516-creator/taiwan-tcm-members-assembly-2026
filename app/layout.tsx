import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 會員大會暨產業參訪｜台灣中藥權益促進會",
  description: "2026 年 9 月 19 日，台灣中藥權益促進會會員大會暨科達製藥產業參訪。查看完整行程、場地交通與行前須知。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
