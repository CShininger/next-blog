'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function ClientNav() {
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex space-x-6">
        <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <ul className="flex space-x-6 items-center">
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
      {user ? (
        <>
          <li>
            <Link
              href="/upload"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              上传文章
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">欢迎, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              注销
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              登录
            </Link>
          </li>
          <li>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              注册
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
