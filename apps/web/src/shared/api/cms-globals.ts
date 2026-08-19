import { cache } from 'react'

import {
  buildPayloadLocaleQuery,
  headerSchema,
  homePageSchema,
  type AppLocale,
  type HeaderInput,
  type HomePageInput,
} from '@iva360/shared'

import { getCmsInternalUrl } from '@/shared/lib/cms-url'

async function fetchCmsGlobal<T>(
  slug: string,
  locale: AppLocale,
  schema: {
    safeParse: (value: unknown) => { success: true; data: T } | { success: false; error: unknown }
  },
  options?: { depth?: number; revalidate?: number },
): Promise<T | null> {
  const query = buildPayloadLocaleQuery({ locale, depth: options?.depth })
  const revalidateSeconds = options?.revalidate ?? 60

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`${getCmsInternalUrl()}/api/globals/${slug}?${query}`, {
      next: { revalidate: revalidateSeconds },
      signal: controller.signal,
    })

    if (!response.ok) {
      console.warn(`[fetchCmsGlobal] ${slug}: CMS responded with ${response.status}`)
      return null
    }

    const json: unknown = await response.json()

    if (!json || typeof json !== 'object' || Object.keys(json).length === 0) {
      return null
    }

    const parsed = schema.safeParse(json)

    if (!parsed.success) {
      console.warn(`[fetchCmsGlobal] ${slug}: schema mismatch`, parsed.error)
      return null
    }

    return parsed.data
  } catch (error) {
    console.warn(`[fetchCmsGlobal] ${slug}:`, error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export const fetchHomePage = cache(async (locale: AppLocale): Promise<HomePageInput | null> => {
  return fetchCmsGlobal('homePage', locale, homePageSchema, { depth: 2, revalidate: 0 })
})

export const fetchHeader = cache(async (locale: AppLocale): Promise<HeaderInput | null> => {
  return fetchCmsGlobal('header', locale, headerSchema, { depth: 2, revalidate: 0 })
})
