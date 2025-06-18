import { DM_Sans } from "next/font/google";
import type { Metadata } from "next";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your profile and account settings",
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