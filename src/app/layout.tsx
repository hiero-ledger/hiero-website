import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// IBM Plex Mono is used for code snippets and other monospaced text.
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
});

// Metadata for the application, including the default title and description.
export const metadata: Metadata = {
  title: {
    default: "Hiero",
    template: "Hiero | %s",
  },
  description:
    "Hiero is the first open-source distributed ledger technology (DLT) developed in a fully vendor-neutral way as a project of the Linux Foundation.",
  icons: {
    icon: "/images/Hiero-Favicon.svg",
    shortcut: "/images/Hiero-Favicon.svg",
    apple: "/images/Hiero-Favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <header className="relative h-22.5">
          <Header />
        </header>
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
