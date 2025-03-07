import { Inter } from 'next/font/google'
import './globals.css'
import ClientProvider from "@/app/context/ClientProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Siemens ERP',
  description: 'Siemens ERP',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ClientProvider >
          {children}
        </ClientProvider >
        </body>
    </html>
  )
}
