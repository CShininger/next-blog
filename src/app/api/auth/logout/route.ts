import { NextResponse } from 'next/server';
import { backendAPI } from '@/lib/backend-api';

export async function POST(request: Request) {
  try {
    // 从cookie中获取token（可选）
    const cookieHeader = request.headers.get('cookie');
    const tokenMatch = cookieHeader?.match(/auth-token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : undefined;

    // 转发请求到后端服务
    const backendResponse = await backendAPI.logout(token);
    const result = await backendResponse.json();

    // 清除cookie
    const response = NextResponse.json(result, {
      status: backendResponse.status,
    });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 立即过期
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('注销代理错误:', error);

    // 即使后端出错，也要清除前端的cookie
    const response = NextResponse.json(
      { success: true, message: '注销成功' },
      { status: 200 }
    );

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  }
}
