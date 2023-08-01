import './globals.css'
import { Inter } from 'next/font/google'
import { GlobalContextProvider } from "./context/store"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Exeam Crafter'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
        </body>
    </html>
  )
}
