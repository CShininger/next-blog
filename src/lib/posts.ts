import { remark } from 'remark';
import html from 'remark-html';
import type { Post, PostMatter } from '@/types/post';
import { markdownDocumentToPost } from '@/types/post';
import { apiClient } from './api-client';
import matter from 'gray-matter';

// 从后端API获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await apiClient.getAllMarkdowns({ limit: 100 });

    if (!response.success || !response.data) {
      console.error('获取文章列表失败:', response.message);
      return [];
    }

    // 转换数据格式
    const posts = response.data.documents.map((doc: any) =>
      markdownDocumentToPost(doc)
    );

    // 按创建时间排序（最新的在前）
    return posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('获取文章列表时出错:', error);
    return [];
  }
}

// 根据ID获取单篇文章
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const response = await apiClient.getMarkdownById(id);

    if (!response.success || !response.data) {
      return null;
    }

    return markdownDocumentToPost(response.data);
  } catch (error) {
    console.error(`获取文章 ${id} 时出错:`, error);
    return null;
  }
}

// 根据slug获取文章（兼容原有接口）
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // 先获取所有文章列表（不包含content）来找到对应的ID
    const allPosts = await getAllPosts();
    const foundPost = allPosts.find((post) => post.slug === slug);

    if (!foundPost) {
      return null;
    }

    // 根据ID获取完整文档（包含content）
    return await getPostById(foundPost._id);
  } catch (error) {
    console.error(`根据slug获取文章 ${slug} 时出错:`, error);
    return null;
  }
}

// 将markdown转换为HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

// 获取所有slug（兼容原有接口）
export async function getAllSlugs(): Promise<string[]> {
  try {
    const allPosts = await getAllPosts();
    return allPosts.map((post) => post.slug || '').filter((slug) => slug);
  } catch (error) {
    console.error('获取所有slug时出错:', error);
    return [];
  }
}

// 搜索文章
export async function searchPosts(
  query: string,
  limit?: number
): Promise<Post[]> {
  try {
    const response = await apiClient.searchMarkdowns(query, limit);

    if (!response.success || !response.data) {
      return [];
    }

    // 转换数据格式
    return response.data.map((doc: any) => markdownDocumentToPost(doc));
  } catch (error) {
    console.error('搜索文章时出错:', error);
    return [];
  }
}

// 解析markdown文件内容（用于上传功能）
export function parseMarkdownContent(content: string): {
  matterData: PostMatter;
  contentBody: string;
} {
  const matterResult = matter(content);
  const { title, date, excerpt, tags, author } =
    matterResult.data as PostMatter;

  return {
    matterData: {
      title,
      date,
      excerpt,
      tags,
      author,
    },
    contentBody: matterResult.content,
  };
}
