import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import dynamic from "next/dynamic";

// Dynamically import N8nChat to avoid SSR issues
const N8nChat = dynamic(() => import("@/components/chat/N8nChat"), {
  ssr: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IQX - Vietnam Stock Express",
  description: "CÔNG TY TNHH VIET NAM STOCK EXPRESS - Nền tảng thông tin chứng khoán Việt Nam hàng đầu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${manrope.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <MainNavigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <N8nChat />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
