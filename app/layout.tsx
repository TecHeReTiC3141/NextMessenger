import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "@/app/context/ToasterContext";
import SessionProvider from "@/app/context/SessionContext";
import ActiveStatus from "@/app/components/ActiveStatus";

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
            <SessionProvider>
                <ActiveStatus />
                <ToasterContext/>
                {children}
            </SessionProvider>
        </body>
        </html>
    );
}
