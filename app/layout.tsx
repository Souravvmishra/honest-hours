import type { Metadata } from "next";
import { Antic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsProvider } from "@/lib/hooks/useSettings";

const antic = Antic({ 
  subsets: ['latin'], 
  weight: '400', 
  variable: '--font-sans',
  display: 'swap', // Prevent font blocking render
  preload: true,
});

export const metadata: Metadata = {
  title: "HonestHours",
  description: "Enforced hourly self-reporting to make unproductive time visible and uncomfortable.",
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
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
