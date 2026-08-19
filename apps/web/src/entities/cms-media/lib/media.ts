export function resolveMediaUrl(media: unknown, cmsBaseUrl: string): string | null {
  if (!media || typeof media !== 'object') {
    return null
  }

  const url = (media as { url?: string | null }).url
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${cmsBaseUrl}${url}`
}

export function isCmsLoopVideoMedia(media: unknown): boolean {
  if (!media || typeof media !== 'object') {
    return false
  }

  const mime = (media as { mimeType?: string | null }).mimeType?.toLowerCase() ?? ''
  return mime.startsWith('video/')
}

export function lexicalToPlainText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (!value || typeof value !== 'object') {
    return ''
  }

  const root = (value as { root?: { children?: unknown[] } }).root
  const chunks: string[] = []

  const walk = (nodes: unknown[] | undefined) => {
    if (!nodes) {
      return
    }

    for (const node of nodes) {
      if (!node || typeof node !== 'object') {
        continue
      }

      const current = node as { text?: string; children?: unknown[]; type?: string }
      if (typeof current.text === 'string') {
        chunks.push(current.text)
      }
      walk(current.children)
    }
  }

  walk(root?.children)
  return chunks.join(' ').replace(/\s+/g, ' ').trim()
}

export function resolveLocalizedString(value: unknown): string | null {
  if (typeof value === 'string') {
    return value
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>
  for (const key of ['ru', 'en']) {
    if (typeof record[key] === 'string') {
      return record[key]
    }
  }

  return null
}
