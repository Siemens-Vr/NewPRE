
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/context/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SIEMENS ERP',
  description: 'Virtual Mechatronics Lab ERP System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}