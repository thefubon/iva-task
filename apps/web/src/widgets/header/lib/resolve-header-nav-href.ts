import { localizeAppHref, sanitizeHref, type AppLocale } from '@iva360/shared'

type NavLinkLike = {
  url?: string | null
}

export function resolveHeaderNavHref(item: NavLinkLike, locale: AppLocale): string | null {
  const manual = sanitizeHref(item.url)
  return manual ? localizeAppHref(manual, locale) : null
}

export function isPlaceholderNavHref(href: string | null | undefined): boolean {
  if (!href) {
    return true
  }

  const trimmed = href.trim()
  return trimmed === '#' || trimmed === '?'
}

export function resolveHeaderNavDestHref(item: NavLinkLike, locale: AppLocale): string | null {
  const href = resolveHeaderNavHref(item, locale)
  return isPlaceholderNavHref(href) ? null : href
}
