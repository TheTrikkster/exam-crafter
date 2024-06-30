import "./globals.css";
import { Inter } from "next/font/google";
import { AppWrapper } from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Exam Crafter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
