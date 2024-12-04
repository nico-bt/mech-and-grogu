import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mech",
  description: "Help Grogu!",
  keywords: [
    "battaglia",
    "nicolas",
    "mandalorian",
    "grogu",
    "fiber",
    "drei",
    "frontend",
    "three",
    "three.js",
  ],
  creator: "Nicolas Battaglia",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
