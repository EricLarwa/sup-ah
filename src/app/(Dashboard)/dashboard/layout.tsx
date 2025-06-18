import { DM_Sans } from "next/font/google";
import Navbar from "./page";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body
        className={`${dmSans.variable} antialiased`}
      >
        {children}
      </body>
  );
}