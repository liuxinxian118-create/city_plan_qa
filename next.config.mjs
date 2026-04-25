/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Docker 部署必需
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,   // Docker 环境不支持图片优化
  },
}

export default nextConfig
