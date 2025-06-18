import type { Metadata } from "next";
import {DM_Sans} from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logging",
  description: "Create and manage logs easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div
        className={`${dmSans.variable} antialiased`}
      >
        {children}
      </div>
  );
}