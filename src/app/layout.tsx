import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Weather App",
  description: "Weather app challenge",
  icons: {
    icon: "/Vector.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-full w-full flex-col bg-(--background-dark) text-(--text-dark)">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

