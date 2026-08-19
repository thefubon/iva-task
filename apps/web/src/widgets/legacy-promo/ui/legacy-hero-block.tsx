import type { CSSProperties } from 'react'
import Link from 'next/link'

import type { LegacyHeroBlockInput } from '@iva360/shared'

import {
  CmsMedia,
  lexicalToPlainText,
  resolveLocalizedString,
} from '@/entities/cms-media'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

type LegacyHeroBlockProps = {
  block: LegacyHeroBlockInput
  cmsBaseUrl: string
  priority?: boolean
}

type HeroButtonData = NonNullable<LegacyHeroBlockInput['primaryButton']>

function heroRootClass(bgType: string): string {
  switch (bgType) {
    case 'greenGradient':
      return 'bg-linear-to-br from-brand-600 to-brand-800 text-white'
    case 'greenBg':
      return 'bg-brand-600 text-white'
    case 'noBg':
      return 'bg-transparent text-foreground'
    case 'customBg':
      return 'text-white'
    case 'grayBg':
    default:
      return 'bg-muted text-foreground'
  }
}

function titleSizeClass(size: string | null | undefined): string {
  switch (size) {
    case 'small':
      return 'text-2xl md:text-3xl'
    case 'medium':
      return 'text-3xl md:text-4xl'
    case 'large':
      return 'text-4xl md:text-5xl'
    case 'xxlarge':
      return 'text-5xl md:text-7xl'
    case 'xlarge':
    default:
      return 'text-4xl md:text-6xl'
  }
}

function Heading({
  level,
  className,
  children,
}: {
  level: string
  className?: string
  children: React.ReactNode
}) {
  const Tag = (['h1', 'h2', 'h3', 'h4'].includes(level) ? level : 'h1') as 'h1' | 'h2' | 'h3' | 'h4'
  return <Tag className={className}>{children}</Tag>
}

function HeroButton({
  button,
  variant,
}: {
  button: HeroButtonData
  variant: 'default' | 'outline'
}) {
  const label = resolveLocalizedString(button.text)?.trim()
  if (!label) {
    return null
  }

  const customStyle: CSSProperties | undefined =
    button.isCustom && button.bgColor && button.textColor
      ? { backgroundColor: button.bgColor, color: button.textColor }
      : undefined

  const href = button.url?.trim()

  if (!href) {
    return (
      <Button size="lg" variant={variant} style={customStyle} type="button">
        {label}
      </Button>
    )
  }

  return (
    <Button size="lg" variant={variant} style={customStyle} render={<Link href={href} />}>
      {label}
    </Button>
  )
}

export function LegacyHeroBlock({ block, cmsBaseUrl, priority = false }: LegacyHeroBlockProps) {
  const title = block.title?.trim() ?? ''
  const bgType = block.bgType ?? 'grayBg'
  const isFullWidth = block.variation === 'fullWidth'
  const imageLeft = block.imagePosition === 'left'
  const description = lexicalToPlainText(block.description)
  const hasButtons = Boolean(block.primaryButton?.text || block.secondaryButton?.text)
  const headerLevel = block.headerLevel ?? 'h1'
  const icon = block.icon && block.icon !== 'none' ? block.icon : null

  const rootStyle =
    bgType === 'customBg' && block.blockBgColor
      ? {
          backgroundColor: block.blockBgColor,
          color: block.blockTextColor ?? '#FFFFFF',
        }
      : undefined

  const inner = (
    <div
      className={cn(
        'overflow-hidden',
        isFullWidth ? 'w-full' : 'rounded-2xl',
        heroRootClass(bgType),
      )}
      style={rootStyle}
    >
      <div className={cn('grid items-center gap-8 px-6 py-12 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-16')}>
        <div
          className={cn(
            'flex flex-col justify-center gap-4',
            imageLeft ? 'lg:order-2' : 'lg:order-1',
          )}
        >
          {title || icon ? (
            <Heading
              level={headerLevel}
              className={cn('font-heading font-bold tracking-tight', titleSizeClass(block.titleSize))}
            >
              {icon ? <span className="mr-3 inline-block align-middle text-sm font-medium opacity-80">{icon}</span> : null}
              <span>{title}</span>
            </Heading>
          ) : null}
          {description ? <p className="max-w-xl text-base leading-relaxed opacity-90">{description}</p> : null}
          {hasButtons ? (
            <div className="mt-4 flex flex-col flex-wrap gap-3 md:flex-row">
              {block.primaryButton?.text ? (
                <HeroButton button={block.primaryButton} variant="default" />
              ) : null}
              {block.secondaryButton?.text ? (
                <HeroButton button={block.secondaryButton} variant="outline" />
              ) : null}
            </div>
          ) : null}
        </div>
        {block.image ? (
          <div className={cn('relative', imageLeft ? 'lg:order-1' : 'lg:order-2')}>
            <CmsMedia
              media={block.image}
              cmsBaseUrl={cmsBaseUrl}
              alt={title}
              priority={priority}
            />
          </div>
        ) : null}
      </div>
    </div>
  )

  if (isFullWidth) {
    return inner
  }

  return <div className="mx-auto w-full max-w-6xl px-6">{inner}</div>
}
