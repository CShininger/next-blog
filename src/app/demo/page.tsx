'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { markdownToHtml } from '@/lib/posts';
import type { Post } from '@/types/post';

export default function DemoPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postHtml, setPostHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取所有文章列表
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
      } else {
        setError('获取文章列表失败');
      }
    } catch (error) {
      setError('网络错误');
      console.error('获取文章列表错误:', error);
    }
  };

  // 获取单个文章详情
  const fetchPostDetail = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${slug}`);
      const result = await response.json();

      if (result.success) {
        setSelectedPost(result.data);
        // 将 markdown 转换为 HTML
        const html = await markdownToHtml(result.data.content);
        setPostHtml(html);
      } else {
        setError('获取文章详情失败');
      }
    } catch (error) {
      setError('网络错误');
      console.error('获取文章详情错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除文章
  const deletePost = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        // 刷新文章列表
        await fetchPosts();
        // 如果删除的是当前选中的文章，清空选中状态
        if (selectedPost?.slug === slug) {
          setSelectedPost(null);
          setPostHtml('');
        }
        alert('文章删除成功');
      } else {
        alert(result.error || '删除失败');
      }
    } catch (error) {
      alert('删除过程中发生错误');
      console.error('删除错误:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← 返回文章列表
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">API 演示页面</h1>
      <p className="text-gray-600 mb-8">
        这个页面演示了如何通过 API 接口获取文章数据并动态渲染。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 文章列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">文章列表 (API)</h2>

          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPost?.slug === post.slug
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => post.slug && fetchPostDetail(post.slug)}
                >
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <div className="flex items-center gap-2">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (post.slug) {
                            deletePost(post.slug);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {post._id} | 文件: {post.fileName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">暂无文章</p>
              <Link
                href="/upload"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                上传第一篇文章
              </Link>
            </div>
          )}
        </div>

        {/* 文章详情 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">文章详情 (API)</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">加载中...</div>
            </div>
          ) : error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
          ) : selectedPost ? (
            <div>
              <header className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPost.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-gray-600 space-x-3">
                    <time className="text-sm">
                      {new Date(selectedPost.createdAt).toLocaleDateString(
                        'zh-CN'
                      )}
                    </time>
                    {selectedPost.author && (
                      <span className="text-sm">
                        作者: {selectedPost.author}
                      </span>
                    )}
                    <span className="text-sm">
                      大小: {(selectedPost.fileSize / 1024).toFixed(1)}KB
                    </span>
                  </div>
                </div>
                {selectedPost.excerpt && (
                  <p className="text-gray-600 italic border-l-4 border-blue-500 pl-3">
                    {selectedPost.excerpt}
                  </p>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  文档ID: {selectedPost._id} | 文件名: {selectedPost.fileName}
                </div>
              </header>

              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: postHtml }}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">点击左侧文章查看详情</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          API 端点说明
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div>
            <code className="bg-blue-100 px-2 py-1 rounded">
              GET /api/posts
            </code>
            <span className="ml-2">获取所有文章列表</span>
          </div>
          <div>
            <code className="bg-blue-100 px-2 py-1 rounded">
              GET /api/posts/[slug]
            </code>
            <span className="ml-2">获取单个文章详情</span>
          </div>
          <div>
            <code className="bg-blue-100 px-2 py-1 rounded">
              POST /api/upload
            </code>
            <span className="ml-2">上传 Markdown 文件</span>
          </div>
          <div>
            <code className="bg-blue-100 px-2 py-1 rounded">
              DELETE /api/posts/[slug]
            </code>
            <span className="ml-2">删除指定文章</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong>{' '}
            此页面展示前端与后端API服务(next_demo_svc)的交互。
            确保后端服务运行在 http://localhost:3001
          </p>
        </div>
      </div>
    </div>
  );
}
