import { Inter } from "next/font/google";
import { SheetDataProvider } from './context/SheetDataContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sales Leaderboard",
  description: "Yo Telecom Sales Leaderboard of SDRs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SheetDataProvider>
      <body className={inter.className}>{children}</body>
      </SheetDataProvider>
    </html>
  );
}
