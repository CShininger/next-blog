# Next.js 博客项目

一个基于 Next.js 15 的现代博客系统，使用 TypeScript 和 Tailwind CSS 构建。

## 🚀 功能特性

- ✅ **现代技术栈**: Next.js 15 + TypeScript + Tailwind CSS
- ✅ **API驱动**: 完全依赖后端API服务获取文章数据
- ✅ **响应式设计**: 在各种设备上都有良好的体验
- ✅ **Markdown支持**: 支持完整的Markdown语法
- ✅ **标签系统**: 文章分类和标签管理
- ✅ **文章上传**: 通过Web界面上传Markdown文件
- ✅ **Docker部署**: 支持Docker容器化部署

## 📋 系统要求

- Node.js 18+
- 后端API服务 (运行在 3001 端口)
- Docker (可选，用于容器化部署)

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **Markdown处理**: gray-matter + remark
- **代码规范**: ESLint + Prettier
- **容器化**: Docker

## 🔧 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 启动后端API服务

确保你的后端API服务运行在 `http://localhost:3001`，提供以下端点：

- `GET /api/v1/markdowns` - 获取文章列表
- `GET /api/v1/markdowns/:id` - 获取单篇文章
- `POST /api/v1/markdowns` - 上传文章
- `DELETE /api/v1/markdowns/:id` - 删除文章

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -t next-blog .
```

### 运行容器

```bash
docker run -d -p 3000:3000 --name next-blog next-blog
```

### 使用 Docker Compose

```bash
docker-compose up -d
```

## 🌐 环境变量

在生产环境中，请设置以下环境变量：

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com/api/v1
```

## 📁 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API路由
│   │   ├── posts/          # 文章页面
│   │   └── upload/         # 文章上传页面
│   ├── lib/                # 工具函数
│   │   ├── api-client.ts   # API客户端
│   │   └── posts.ts        # 文章数据处理
│   └── types/              # TypeScript类型定义
├── Dockerfile              # Docker配置
├── docker-compose.yml      # Docker Compose配置
└── README.md               # 项目文档
```

## 🔗 API接口

### 文章数据格式

```typescript
interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  author: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  date: string;
}
```

## 📝 使用说明

1. **查看文章**: 访问 `/posts` 查看所有文章
2. **阅读文章**: 点击文章标题进入详情页
3. **上传文章**: 访问 `/upload` 上传Markdown文件
4. **API演示**: 访问 `/demo` 查看API调用示例

## 🚀 部署注意事项

- 确保后端API服务可访问
- 生产环境需要设置正确的API_BASE_URL
- 建议使用HTTPS协议
- 可配置Nginx反向代理

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支
3. 提交你的修改
4. 发起 Pull Request

## 📄 许可证

MIT License






