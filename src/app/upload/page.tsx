'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface UploadResult {
  message: string;
  fileName: string;
  slug: string;
  documentId: string;
}

interface ErrorResult {
  error: string;
}

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [uploadedSlug, setUploadedSlug] = useState<string | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(
    null
  );

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage({ type: 'error', text: '请选择一个文件' });
      return;
    }

    if (!file.name.endsWith('.md')) {
      setMessage({ type: 'error', text: '请选择 .md 格式的文件' });
      return;
    }

    setUploading(true);
    setMessage(null);
    setUploadedSlug(null);
    setUploadedDocumentId(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = (await response.json()) as UploadResult;
        setMessage({ type: 'success', text: result.message });
        setUploadedSlug(result.slug);
        setUploadedDocumentId(result.documentId);
        // 清空文件选择
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorResult = (await response.json()) as ErrorResult;
        setMessage({ type: 'error', text: errorResult.error || '上传失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '上传过程中发生错误' });
      console.error('上传错误:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = () => {
    setMessage(null);
    setUploadedSlug(null);
    setUploadedDocumentId(null);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← 返回文章列表
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">上传文章</h1>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                选择 Markdown 文件
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".md"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                请选择 .md 格式的文件。文件应包含有效的 front matter（title,
                date, excerpt 等）。文件将上传到后端MongoDB数据库中。
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full px-4 py-2 rounded-lg font-medium ${
                uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
            >
              {uploading ? '正在上传到后端服务...' : '上传文件'}
            </button>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {uploadedSlug && uploadedDocumentId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-2">文件上传成功！</p>
                <div className="text-sm text-blue-600 mb-3">
                  <p>文档ID: {uploadedDocumentId}</p>
                  <p>文件slug: {uploadedSlug}</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/posts/${uploadedSlug}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    查看文章
                  </Link>
                  <Link
                    href="/posts"
                    className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    返回列表
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              文件格式要求
            </h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Markdown 文件需要包含以下 front matter：</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {`---
title: '文章标题'
date: '2024-01-01'
excerpt: '文章摘要'
tags: ['标签1', '标签2']
author: '作者名'
---

# 文章内容

这里是文章的正文内容...`}
              </pre>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  <strong>注意:</strong>{' '}
                  文件将通过API上传到后端MongoDB数据库中，不再保存到本地文件系统。
                  确保后端服务 (next_demo_svc) 正在运行在 http://localhost:3001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
