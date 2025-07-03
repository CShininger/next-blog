# Next.js Markdown博客系统

这是一个使用Next.js构建的Markdown博客系统，现已集成后端API服务进行文档管理。

## 系统架构

- **前端**: Next.js + React + TypeScript + Tailwind CSS
- **后端**: next_demo_svc (Express + MongoDB)
- **数据存储**: MongoDB (通过后端服务)

## 快速开始

### 1. 启动后端服务

首先确保后端服务`next_demo_svc`正在运行：

```bash
cd next_demo_svc
npm install
npm run dev
```

后端服务将运行在 `http://localhost:3001`

### 2. 启动前端服务

```bash
cd next_demo
npm install
npm run dev
```

前端服务将运行在 `http://localhost:3000`

## 功能特性

### 文章管理
- ✅ 文章上传 (支持.md文件)
- ✅ 文章列表展示
- ✅ 文章详情查看
- ✅ 文章删除
- ✅ 标签管理
- ✅ 搜索功能

### API接口
- `POST /api/upload` - 上传Markdown文件
- `GET /api/posts` - 获取所有文章
- `GET /api/posts/[slug]` - 获取特定文章
- `DELETE /api/posts/[slug]` - 删除文章

## 环境配置

在`next_demo`目录下创建`.env.local`文件：

```env
# 后端API服务地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

## 文件格式要求

上传的Markdown文件需要包含front matter：

```markdown
---
title: '文章标题'
date: '2024-01-01'
excerpt: '文章摘要'
tags: ['标签1', '标签2']
author: '作者名'
---

# 文章内容

这里是文章的正文内容...
```

## 数据流程

1. **文件上传**: 
   - 前端接收.md文件
   - 解析front matter
   - 调用后端API存储到MongoDB

2. **文章展示**:
   - 从后端API获取文章列表
   - 转换数据格式适配前端组件
   - 渲染文章列表和详情

3. **文章管理**:
   - 通过后端API进行CRUD操作
   - 支持按标签筛选和搜索

## 项目结构

```
next_demo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API路由
│   │   ├── posts/          # 文章页面
│   │   └── upload/         # 上传页面
│   ├── lib/                # 工具库
│   │   ├── api-client.ts   # API客户端
│   │   └── posts.ts        # 文章处理逻辑
│   ├── types/              # TypeScript类型定义
│   └── components/         # React组件
├── .env.local              # 环境变量配置
└── package.json
```

## 后端API说明

后端服务提供以下API接口：

- `POST /api/v1/markdowns` - 创建文档
- `GET /api/v1/markdowns` - 获取文档列表（支持分页）
- `GET /api/v1/markdowns/:id` - 获取单个文档
- `PUT /api/v1/markdowns/:id` - 更新文档
- `DELETE /api/v1/markdowns/:id` - 删除文档
- `GET /api/v1/markdowns/search` - 搜索文档

## 注意事项

1. 确保MongoDB服务正在运行
2. 确保后端服务先于前端服务启动
3. 文件上传大小限制为10MB
4. 支持的文件格式仅为.md

## 开发说明

### 类型转换

前端使用`markdownDocumentToPost`函数将后端返回的MongoDB文档转换为前端所需的Post类型：

```typescript
export function markdownDocumentToPost(doc: any): Post {
  return {
    _id: doc._id,
    slug: doc.fileName.replace(/\.md$/, ''),
    title: doc.title,
    date: doc.createdAt,
    excerpt: doc.description || doc.content.substring(0, 200) + '...',
    content: doc.content,
    tags: doc.tags,
    author: doc.author || '',
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    description: doc.description,
  };
}
```

### API客户端

使用`ApiClient`类封装所有与后端的HTTP通信：

```typescript
import { apiClient } from '@/lib/api-client';

// 获取所有文章
const posts = await apiClient.getAllMarkdowns();

// 上传文章
const result = await apiClient.uploadMarkdown(data);
```
