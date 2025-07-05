/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 强制所有页面使用服务端渲染
  trailingSlash: false,
};

module.exports = nextConfig;
