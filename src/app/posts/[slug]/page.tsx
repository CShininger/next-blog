import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllSlugs, markdownToHtml } from '@/lib/posts';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: `${post.title} - 我的博客`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← 返回文章列表
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 space-x-4">
            <time className="text-sm">
              {new Date(post.createdAt).toLocaleDateString('zh-CN')}
            </time>
            {post.author && (
              <span className="text-sm">作者: {post.author}</span>
            )}
            <span className="text-sm">
              文件大小: {(post.fileSize / 1024).toFixed(1)}KB
            </span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {post.excerpt && (
          <p className="text-xl text-gray-600 italic border-l-4 border-blue-500 pl-4">
            {post.excerpt}
          </p>
        )}
        <div className="text-xs text-gray-400 mt-2">
          文档ID: {post._id} | 文件名: {post.fileName}
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 返回文章列表
          </Link>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            返回首页 →
          </Link>
        </div>
      </footer>
    </article>
  );
}
