import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  try {
    const posts = await getAllPosts();

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('获取文章列表时出错:', error);
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 });
  }
}
