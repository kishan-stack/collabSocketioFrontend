import localfont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import { SocketProvider } from "@/context/socketContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./AuthProvider";
const geistSans = localfont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
    subsets: ["latin"],
});

const geistMono = localfont({
    src: "./fonts/GeistMonoVF.woff",
    weight: "100 900",
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Collab.io",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    // const { idToken, user: kindeUser } = useKindeAuth();
    return (
        <AuthProvider>
            <SocketProvider>
                <html lang="en">
                    <body
                        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                    >
                        {children}
                        <ToastContainer />
                    </body>
                </html>
            </SocketProvider>
        </AuthProvider>
    );
}
