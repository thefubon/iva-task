import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import { parseCmsEnv } from '@iva360/shared/schemas'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'

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
const csrfOrigins = [...new Set([cmsPublicUrl, webPublicUrl].filter(Boolean))]

const seedAdminEmail = 'admin@iva360.ru'
const seedAdminPassword = 'admin'

export default buildConfig({
  serverURL: cmsPublicUrl,
  csrf: csrfOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, './app/admin/importMap.js'),
    },
    meta: {
      titleSuffix: ' — IVA360',
    },
  },
  collections: [Users, Media],
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
