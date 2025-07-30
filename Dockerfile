# 阶段1：依赖安装
FROM node:18-alpine AS deps
# 检查是否需要 libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 设置国内 npm 镜像源（加速下载）
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json（如果存在）
COPY package.json package-lock.json* ./
# 安装依赖
RUN npm ci --prefer-offline --no-audit

# 阶段2：构建应用
FROM node:18-alpine AS builder
WORKDIR /app
# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
# 复制源代码
COPY . .

# 设置环境变量（如果需要）
# ENV NEXT_PUBLIC_API_URL=http://your-backend-api

# 构建 Next.js 应用
RUN npm run build

# 阶段3：生产环境运行
FROM node:18-alpine AS runner
WORKDIR /app

# 设置为生产环境
ENV NODE_ENV=production
# 禁用 Next.js 遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 创建public目录
RUN mkdir -p ./public

# 自动利用输出跟踪减少镜像大小
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# ✅ 关键：复制 public 目录
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置端口环境变量
ENV PORT=3000

# 启动 Next.js
CMD ["node", "server.js"] 