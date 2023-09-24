import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from './Analytics'

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
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning={true}>
          {children}
          <Analytics />
      </body>
    </html>
  )
}
