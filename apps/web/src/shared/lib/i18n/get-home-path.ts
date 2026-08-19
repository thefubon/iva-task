export function getHomePath(locale: 'ru' | 'en'): string {
  return locale === 'en' ? '/en' : '/'
}
