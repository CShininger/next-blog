# Next.js Markdown博客系统

这是一个使用Next.js构建的Markdown博客系统，现已集成后端API服务进行文档管理。

## 系统架构

- **前端**: Next.js + React + TypeScript + Tailwind CSS
- **后端**: [express](https://github.com/CShininger/md-svc)
- **数据存储**: MongoDB (通过后端服务)

## 快速开始

### 1. 启动后端服务

首先确保后端服务 `md-svc`正在运行：

```bash
npm install
npm run dev
```

后端服务将运行在 `http://localhost:3001`

### 2. 启动前端服务

```bash
cd next-blog
npm install
npm run dev
```

前端服务将运行在 `http://localhost:3000`






