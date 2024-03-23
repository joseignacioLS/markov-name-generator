import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Modal from "./components/Modal/Modal";
import Toast from "./components/Toast/Toast";
import Nav from "./components/Nav/Nav";
import ContextProvider from "./context/ContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Name Wizard",
  description: "A name generator tool based on markov chains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={inter.className}>
        <ContextProvider>
          <Nav />
          {children}
          <Modal />
          <Toast />
        </ContextProvider>
      </body>
    </html>
  );
}
