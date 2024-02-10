import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "@/app/context/ToasterContext";

const inter = Inter({ subsets: [ "latin" ] });

export const metadata: Metadata = {
    title: "Messaging clone app",
    description: "Made after Antonio",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <ToasterContext/>
            {children}
        </body>
        </html>
    );
}
