import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { apiClient } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    // 检查文件类型
    if (!file.name.endsWith('.md')) {
      return NextResponse.json({ error: '只支持 .md 文件' }, { status: 400 });
    }

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(arrayBuffer);

    // 解析markdown文件的front matter
    const matterResult = matter(content);
    const frontMatter = matterResult.data;
    const markdownContent = matterResult.content;

    // 提取必要信息
    const title = frontMatter.title || file.name.replace(/\.md$/, '');
    const description = frontMatter.excerpt || frontMatter.description || '';
    const tags = frontMatter.tags || [];

    // 清理文件名
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    try {
      // 调用后端API上传文档
      const response = await apiClient.uploadMarkdown({
        title,
        content: markdownContent,
        fileName,
        tags,
        description,
      });

      if (response.success) {
        return NextResponse.json({
          message: '文件上传成功',
          fileName: fileName,
          slug: fileName.replace(/\.md$/, ''),
          documentId: response.data._id,
        });
      } else {
        return NextResponse.json(
          { error: response.message || '上传失败' },
          { status: 400 }
        );
      }
    } catch (apiError: any) {
      console.error('调用后端API时出错:', apiError);
      return NextResponse.json(
        { error: `后端服务错误: ${apiError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('上传文件时出错:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
