/**
 * Allowlist-санитизация href из CMS.
 */
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])

export function sanitizeHref(raw?: string | null, fallback: string | null = null): string | null {
  if (typeof raw !== 'string') {
    return fallback
  }

  const value = raw.replace(/[\u0000-\u001F\u007F]/g, '').trim()

  if (!value) {
    return fallback
  }

  if (value.startsWith('//')) {
    return fallback
  }

  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('?')) {
    return value
  }

  const schemeMatch = /^([a-z][a-z0-9+.-]*):/i.exec(value)
  if (schemeMatch) {
    const scheme = schemeMatch[1]!.toLowerCase()
    if (!SAFE_SCHEMES.has(scheme)) {
      return fallback
    }
    return value
  }

  return value
}

export function isSafeHref(raw?: string | null): boolean {
  return raw != null && raw !== '' && sanitizeHref(raw) != null
}
