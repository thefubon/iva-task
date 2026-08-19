import { z } from 'zod'

const nonEmpty = z.string().min(1)

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema)

export const cmsEnvSchema = z.object({
  MONGODB_URI: nonEmpty,
  PAYLOAD_SECRET: nonEmpty,
  WEB_INTERNAL_URL: emptyToUndefined(z.string().url().optional()),
})

export const webEnvSchema = z.object({
  CMS_INTERNAL_URL: emptyToUndefined(z.string().url().default('http://localhost:3333')),
  CMS_PUBLIC_URL: emptyToUndefined(z.string().url().optional()),
  WEB_PUBLIC_URL: emptyToUndefined(z.string().url().optional()),
})

export type CmsEnv = z.infer<typeof cmsEnvSchema>
export type WebEnv = z.infer<typeof webEnvSchema>

export function parseCmsEnv(env: NodeJS.ProcessEnv = process.env): CmsEnv {
  return cmsEnvSchema.parse(env)
}

export function parseWebEnv(env: NodeJS.ProcessEnv = process.env): WebEnv {
  return webEnvSchema.parse(env)
}
