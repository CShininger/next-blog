import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';
import { apiClient } from '@/lib/api-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('获取文章时出错:', error);
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 首先通过slug找到文章
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // 调用后端API删除文档
    const response = await apiClient.deleteMarkdown(post._id);

    if (response.success) {
      return NextResponse.json({
        success: true,
        message: '文章删除成功',
      });
    } else {
      return NextResponse.json(
        { error: response.message || '删除失败' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('删除文章时出错:', error);
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}
