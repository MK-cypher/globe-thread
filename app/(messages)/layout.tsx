import Navbar from "@/components/Navbar";
import {ThemeProvider} from "@/components/theme-provider";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../globals.css";
import {getUser} from "@/actions/users";
import {Toaster} from "@/components/ui/toaster";
import {UserProvider} from "@/context/userContext";
import {metaDataConfig} from "@/lib/utils";
import ConversationsMenu from "@/components/ConversationsMenu";
import {getAllConversations} from "@/actions/conversations";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = metaDataConfig();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUser();
  const conversations = await getAllConversations();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className={`${inter.className} min-h-svh flex flex-col bg-background`}>
          <UserProvider initialUser={userData}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Navbar />
              <div className="flex-grow mt-20">
                <div
                  className="h-[calc(100svh-80px)] gap-2 grid relative overflow-hidden transition-all duration-300"
                  id="chat-section"
                >
                  {userData && <ConversationsMenu conversations={conversations} user={userData} />}
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
