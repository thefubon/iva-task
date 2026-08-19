import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const cmsSecurityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]

const cmsAdminAssetPrefix = process.env.CMS_ADMIN_ASSET_PREFIX?.trim() || undefined

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(dirname, '../..'),
  ...(cmsAdminAssetPrefix ? { assetPrefix: cmsAdminAssetPrefix } : {}),
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    if (!cmsAdminAssetPrefix) {
      return []
    }

    return [
      {
        source: `${cmsAdminAssetPrefix}/_next/:path*`,
        destination: '/_next/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: cmsSecurityHeaders,
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  transpilePackages: ['@iva360/shared'],
  turbopack: {
    root: path.resolve(dirname, '../..'),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
