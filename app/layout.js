import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Creov",
  description: "AI Powered Website Builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}