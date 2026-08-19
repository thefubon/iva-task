export function localizeAppHref(href: string, locale: 'ru' | 'en'): string {
  if (locale !== 'en') {
    return href
  }

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('#') ||
    href.startsWith('?') ||
    href.startsWith('/en')
  ) {
    return href
  }

  if (href.startsWith('/')) {
    return `/en${href}`
  }

  return href
}
