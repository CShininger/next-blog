import { NextResponse } from 'next/server';
import { backendAPI } from '@/lib/backend-api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 转发请求到后端服务
    const backendResponse = await backendAPI.login(email, password);
    const result = await backendResponse.json();

    // 如果登录成功，设置cookie
    if (result.success && result.token) {
      const response = NextResponse.json(result, {
        status: backendResponse.status,
      });

      // 设置HttpOnly cookie
      response.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24小时
        path: '/',
      });

      return response;
    }

    // 登录失败，直接返回后端响应
    return NextResponse.json(result, { status: backendResponse.status });
  } catch (error) {
    console.error('登录代理错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
