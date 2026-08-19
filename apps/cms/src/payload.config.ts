import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import { parseCmsEnv } from '@iva360/shared/schemas'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Header } from './globals/Header'
import { HomePage } from './globals/HomePage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isNextBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
const isPayloadCliPhase =
  process.env.PAYLOAD_CLI === 'true' ||
  process.argv.some((a) => a.includes('generate:types') || a.includes('generate:importmap'))

if (!isNextBuildPhase && !isPayloadCliPhase) {
  parseCmsEnv()
}

const cmsPublicUrl = process.env.CMS_PUBLIC_URL || 'http://localhost:3333'
const webPublicUrl = process.env.WEB_PUBLIC_URL || 'http://localhost:3033'
const payloadServerUrl = process.env.PAYLOAD_SERVER_URL || webPublicUrl
const csrfOrigins = [
  ...new Set(
    [
      cmsPublicUrl,
      webPublicUrl,
      payloadServerUrl,
      'http://127.0.0.1:3033',
      'http://127.0.0.1:3333',
    ].filter(Boolean),
  ),
]

const s3Bucket = process.env.S3_BUCKET
const useS3Storage = Boolean(
  s3Bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
)

const seedAdminEmail = 'admin@iva360.ru'
const seedAdminPassword = 'admin'

export default buildConfig({
  // Админка открывается через web (:3033/admin). Origin в браузере должен совпадать,
  // иначе cookie/CSRF/server actions уходят на :3333 и форма остаётся read-only.
  serverURL: payloadServerUrl,
  csrf: csrfOrigins,
  cors: csrfOrigins,
  admin: {
    user: Users.slug,
    autoLogin: {
      email: seedAdminEmail,
      password: seedAdminPassword,
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, './app/admin/importMap.js'),
    },
    meta: {
      titleSuffix: ' — IVA360',
    },
  },
  collections: [Users, Media],
  globals: [HomePage, Header],
  plugins: [
    ...(useS3Storage
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: s3Bucket!,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              region: process.env.S3_REGION || 'us-east-1',
              ...(process.env.S3_ENDPOINT
                ? {
                    endpoint: process.env.S3_ENDPOINT,
                    forcePathStyle: true,
                  }
                : {}),
            },
          }),
        ]
      : []),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/shared/src/payload-types.ts'),
  },
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'ru',
  },
  localization: {
    locales: [
      { code: 'ru', label: 'Русский' },
      { code: 'en', label: 'Английский' },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iva360',
  }),
  sharp,
  onInit: async (payload) => {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: seedAdminEmail } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return
    }

    await payload.create({
      collection: 'users',
      data: {
        email: seedAdminEmail,
        password: seedAdminPassword,
        name: 'Admin',
      },
    })

    payload.logger.info(`Seeded CMS admin: ${seedAdminEmail} / ${seedAdminPassword}`)
  },
})
