import type { Metadata } from "next";
import { Antic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const antic = Antic({ subsets: ['latin'], weight: '400', variable: '--font-sans' });

export const metadata: Metadata = {
  title: "HonestHours",
  description: "Enforced hourly self-reporting to make unproductive time visible and uncomfortable.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-black-no-bg.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={antic.variable} suppressHydrationWarning>
      <body
        className={`${antic.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="honesthours-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
