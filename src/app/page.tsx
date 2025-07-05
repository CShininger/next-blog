import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

// 强制动态渲染，不进行静态生成
export const dynamic = 'force-dynamic';

export default async function Home() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 5); // 显示最新的5篇文章

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          这里分享我的技术学习笔记、项目经验和思考感悟
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">最新文章</h2>
        {latestPosts.length > 0 ? (
          <div className="grid gap-6">
            {latestPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <time>
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </time>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    阅读更多 →
                  </Link>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
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
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有发布文章，敬请期待！</p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              上传第一篇文章
            </Link>
          </div>
        )}
      </section>

      {allPosts.length > 5 && (
        <div className="text-center">
          <Link
            href="/posts"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看所有文章
          </Link>
        </div>
      )}
    </div>
  );
}
