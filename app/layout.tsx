import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ЛуЛу Альпака — Бронирование экскурсий",
  description: "Забронируйте незабываемую экскурсию на ферму альпак. Современная система бронирования с моментальным подтверждением.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="min-h-screen bg-[#050505]">{children}</body>
    </html>
  );
}
