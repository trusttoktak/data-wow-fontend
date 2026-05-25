import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "../components/Toast";

export const metadata: Metadata = {
  title: "Concert Tickets | Data Wow",
  description: "Free concert ticket reservation platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
