import Image from 'next/image'

import { cn } from '@/shared/lib/utils'

import { isCmsLoopVideoMedia, resolveMediaUrl } from '../lib/media'

type CmsMediaProps = {
  media: unknown
  cmsBaseUrl: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  rounded?: boolean
  videoAspect?: '16/9' | '4/3' | null
}

export function CmsMedia({
  media,
  cmsBaseUrl,
  alt,
  className,
  width,
  height,
  priority = false,
  rounded = false,
  videoAspect,
}: CmsMediaProps) {
  const src = resolveMediaUrl(media, cmsBaseUrl)
  if (!src) {
    return null
  }

  const roundedClass = rounded ? 'rounded-lg' : undefined

  const mime =
    typeof media === 'object' && media && 'mimeType' in media
      ? String((media as { mimeType?: string | null }).mimeType ?? '')
      : ''

  if (mime.includes('svg')) {
    return (
      // SVG из CMS / MinIO — next/image не оптимизирует.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn('h-auto w-full max-w-full object-contain', roundedClass, className)} />
    )
  }

  if (isCmsLoopVideoMedia(media)) {
    const aspect = videoAspect === '4/3' ? 'aspect-[4/3]' : 'aspect-video'

    return (
      <video
        className={cn('h-auto w-full object-cover', aspect, roundedClass, className)}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
      />
    )
  }

  const resolvedWidth =
    width ?? (typeof media === 'object' && media && 'width' in media ? Number(media.width) || 1200 : 1200)
  const resolvedHeight =
    height ??
    (typeof media === 'object' && media && 'height' in media ? Number(media.height) || 800 : 800)

  return (
    <Image
      src={src}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      priority={priority}
      className={cn('h-auto w-full max-w-full object-contain', roundedClass, className)}
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  )
}
