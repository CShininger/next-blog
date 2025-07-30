import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import { ClientNav } from '@/components/ClientNav'
import './globals.css'
import Footer from '@/components/footer'

export const metadata = {
  title: '丑小鹅的博客 - 前端技术学习',
  description: '丑小鹅的博客，总结学习前端技术时遇到的问题和解决方法',
  keywords: '丑小鹅, 前端博客, React, Next.js',
  icons: {
    icon: '/uxksjgiroi1232312_favicon.png',
  },
  openGraph: {
    title: '丑小鹅的博客',
    description: '分享前端开发中遇到的问题和解决方法',
    url: 'https://swanqing.com',
    siteName: '丑小鹅的博客',
    images: [
      {
        url: 'https://swanqing.com/cover.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  other: {
    'baidu-site-verification': 'codeva-9OHpQOexge',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <AuthProvider>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <nav className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  <Link href="/">丑小鹅的博客</Link>
                </h1>
                <ClientNav />
              </nav>
            </div>
          </header>
          <main className="flex-1 w-full">{children}</main>
          <footer className="bg-gray-100 mt-auto">
            <Footer />
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
