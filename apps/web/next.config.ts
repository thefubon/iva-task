import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import { parseWebEnv } from '@iva360/shared/schemas'

parseWebEnv()

import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const cmsInternalUrl = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'
const cmsImagePort = new URL(cmsInternalUrl).port || '3333'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(dirname, '../..'),
  env: {
    WEB_PORT: process.env.WEB_PORT ?? '3033',
  },
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3033', 'localhost:3333', '127.0.0.1:3033', '127.0.0.1:3333'],
    },
  },
  async rewrites() {
    return [
      {
        source: '/admin/_next/:path*',
        destination: `${cmsInternalUrl}/_next/:path*`,
      },
      {
        source: '/admin/:path*',
        destination: `${cmsInternalUrl}/admin/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${cmsInternalUrl}/api/:path*`,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: cmsImagePort,
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: cmsImagePort,
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: process.env.MINIO_API_PORT || '9002',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: process.env.MINIO_API_PORT || '9002',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['@iva360/shared'],
  turbopack: {
    root: path.resolve(dirname, '../..'),
  },
}

export default nextConfig
