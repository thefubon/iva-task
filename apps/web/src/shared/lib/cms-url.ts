export function getCmsInternalUrl(): string {
  return process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'
}

/**
 * Base URL медиа для HTML. Пустая строка → same-origin `/api/*` через rewrite.
 */
export function getCmsPublicUrl(): string {
  const raw = process.env.CMS_PUBLIC_URL?.trim() || process.env.WEB_PUBLIC_URL?.trim() || ''
  if (raw) {
    return raw.replace(/\/$/, '')
  }
  return ''
}
