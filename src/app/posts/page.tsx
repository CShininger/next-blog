import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function PostsPage() {
  const allPosts = await getAllPosts();

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">所有文章</h1>
        <p className="text-gray-600">共 {allPosts.length} 篇文章</p>
      </header>

      <div className="flex justify-end mb-6">
        <Link
          href="/upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          上传新文章
        </Link>
      </div>

      {allPosts.length > 0 ? (
        <div className="grid gap-6">
          {allPosts.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <time>
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </time>
                  {post.author && <span>作者: {post.author}</span>}
                  <span>文件大小: {(post.fileSize / 1024).toFixed(1)}KB</span>
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
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  阅读全文 →
                </Link>
                <div className="text-xs text-gray-400">文档ID: {post._id}</div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            还没有发布文章，敬请期待！
          </p>
          <Link
            href="/upload"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            上传第一篇文章
          </Link>
        </div>
      )}
    </div>
  );
}
