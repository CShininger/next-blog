import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '我的博客',
  description: '基于Next.js和TypeScript的个人博客',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <Link href="/">我的博客</Link>
              </h1>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    首页
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    文章
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upload"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    上传文章
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-100 mt-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>&copy; 2024 我的博客. 使用 Next.js 构建</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
