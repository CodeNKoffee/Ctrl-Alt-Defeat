// import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, Young_Serif } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import GlobalCallHandler from "../components/GlobalCallHandler";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

const youngSerif = Young_Serif({
  weight: ["400"],
  variable: "--font-young-serif",
  subsets: ["latin"],
});

export const metadata = {
  title: "GUC Internship Portal",
  description: "The German University in Cairo Newest Internship Platform",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${ibmPlexSans.variable} ${youngSerif.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
          <GlobalCallHandler />
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
