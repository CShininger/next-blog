import { NextResponse } from 'next/server';
import { backendAPI } from '@/lib/backend-api';

export async function GET(request: Request) {
  try {
    // 从cookie中获取token
    const cookieHeader = request.headers.get('cookie');
    const tokenMatch = cookieHeader?.match(/auth-token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    // 转发请求到后端服务
    const backendResponse = await backendAPI.me(token);
    const result = await backendResponse.json();

    return NextResponse.json(result, { status: backendResponse.status });
  } catch (error) {
    console.error('获取用户信息代理错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
