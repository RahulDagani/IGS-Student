import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from "@/context/AuthContext";
import RootLayoutClient from '@/components/RootLayoutClient';
import GoogleAuthProvider from '@/components/GoogleAuthProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        
        <GoogleAuthProvider>
          <AuthProvider>
            <ThemeProvider>
              <SidebarProvider>
                <RootLayoutClient>
                  {children}
                </RootLayoutClient>
              </SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}