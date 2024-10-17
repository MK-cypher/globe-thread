import {Inter} from "next/font/google";
import "../globals.css";
import Link from "next/link";
import {Metadata} from "next";
import {ThemeProvider} from "@/components/theme-provider";
import {metaDataConfig} from "@/lib/utils";
import Logo from "@/components/Logo";

export const metadata: Metadata = metaDataConfig();

const inter = Inter({subsets: ["latin"]});

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " dashboard"}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <nav className="py-5 fixed w-full container">
            <div className="wrapper">
              <Logo />
            </div>
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
