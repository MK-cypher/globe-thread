import Navbar from "@/components/Navbar";
import {ThemeProvider} from "@/components/theme-provider";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../globals.css";
import {getUser} from "@/actions/users";
import {Toaster} from "@/components/ui/toaster";
import {UserProvider} from "@/context/userContext";
import {metaDataConfig} from "@/lib/utils";
import PostsFilter from "@/components/PostsFilter";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = metaDataConfig();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className={`${inter.className} min-h-svh flex flex-col bg-background`}>
          <UserProvider initialUser={userData}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Navbar />
              <div className="flex-grow mt-20">
                <div className="relative flex gap-4 items-stretch container">
                  {/* <PostsFilter /> */}
                  {children}
                </div>
              </div>
            </ThemeProvider>
            <Toaster />
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
