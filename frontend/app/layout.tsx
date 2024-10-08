import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@solana/wallet-adapter-react-ui/styles.css';
import { Inter as FontSans } from "next/font/google" 
import { cn } from "@/lib/utils"
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body  className={cn(
          "bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <Toaster
            position="top-left"
            reverseOrder={false}
          />
          {children}
      </body>
    </html>
  );
}
