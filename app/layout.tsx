import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "@/app/context/ToasterContext";
import SessionProvider from "@/app/context/SessionContext";
import ActiveStatus from "@/app/components/ActiveStatus";

const inter = Inter({ subsets: [ "latin" ] });

export const metadata: Metadata = {
    title: {
        template: "%s | Next Messenger",
        default: "Next Messenger"
    },
    description: "Simple messaging app",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider>
            <ActiveStatus/>
            <ToasterContext/>
            {children}
        </SessionProvider>
        </body>
        </html>
    );
}
