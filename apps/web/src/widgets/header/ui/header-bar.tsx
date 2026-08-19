'use client'

import { Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import * as Hugeicons from '@hugeicons/core-free-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { AppLocale, HeaderAuthButtonsInput, HeaderNavItemInput, TopbarLinkInput } from '@iva360/shared'

import { CmsMedia } from '@/entities/cms-media'
import { getHomePath } from '@/shared/lib/i18n/get-home-path'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

import { resolveNavItemLabelForSurface, resolveNavSubItemLabelForSurface } from '../lib/header-nav-label-surface'
import { resolveHeaderNavDestHref } from '../lib/resolve-header-nav-href'

type HeaderBarProps = {
  locale: AppLocale
  cmsBaseUrl: string
  siteName: string
  logo: unknown
  navigation: HeaderNavItemInput[]
  phones: TopbarLinkInput[]
  rightLinks: TopbarLinkInput[]
  authButtons?: HeaderAuthButtonsInput | null
}

function resolveHugeicon(name: string | null | undefined): IconSvgElement | null {
  if (!name) {
    return null
  }

  const icon = (Hugeicons as Record<string, unknown>)[name]
  return Array.isArray(icon) ? (icon as IconSvgElement) : null
}

function TopbarLink({
  link,
  cmsBaseUrl,
  className,
}: {
  link: TopbarLinkInput
  cmsBaseUrl: string
  className?: string
}) {
  const label = link.number?.trim()
  if (!label) {
    return null
  }

  const href = link.url?.trim()
  const iconType = link.iconType ?? 'none'
  const hugeicon = iconType === 'hugeicons' ? resolveHugeicon(link.hugeiconsName) : null

  const content = (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      {iconType === 'custom' && link.customIcon ? (
        <CmsMedia media={link.customIcon} cmsBaseUrl={cmsBaseUrl} alt="" className="size-4" width={16} height={16} />
      ) : null}
      {hugeicon ? <HugeiconsIcon icon={hugeicon} strokeWidth={2} className="size-4" /> : null}
      <span>{label}</span>
    </span>
  )

  if (!href) {
    return content
  }

  return (
    <Link
      href={href}
      className="hover:text-primary transition-colors"
      {...(link.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
    >
      {content}
    </Link>
  )
}

function NavLink({
  item,
  locale,
  cmsBaseUrl,
  surface,
}: {
  item: HeaderNavItemInput
  locale: AppLocale
  cmsBaseUrl: string
  surface: 'desktop' | 'mobile'
}) {
  const label = resolveNavItemLabelForSurface(item, surface)
  const href = resolveHeaderNavDestHref(item, locale)
  const icon = surface === 'mobile' ? (item.mobileIcon ?? item.icon) : item.mobileMenuOnly ? null : item.icon
  const subItems = item.subItems ?? []

  if (surface === 'desktop' && subItems.length > 0) {
    return (
      <div className="group relative">
        {href ? (
          <Link
            href={href}
            className="hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium xl:text-base"
            {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
          >
            {icon ? <CmsMedia media={icon} cmsBaseUrl={cmsBaseUrl} alt="" className="size-5" width={20} height={20} /> : null}
            {label}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium xl:text-base">{label}</span>
        )}
        <div className="invisible absolute top-full left-0 z-50 min-w-64 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
          <div className="bg-background grid gap-1 rounded-xl border p-3 shadow-lg">
            {subItems.map((sub) => {
              const subHref = resolveHeaderNavDestHref(sub, locale)
              const subLabel = resolveNavSubItemLabelForSurface(sub, surface)
              const subIcon = sub.icon
              if (!subLabel) {
                return null
              }

              const inner = (
                <span className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-2 font-medium">
                    {subIcon ? (
                      <CmsMedia media={subIcon} cmsBaseUrl={cmsBaseUrl} alt="" className="size-5" width={20} height={20} />
                    ) : null}
                    {subLabel}
                  </span>
                  {sub.description?.trim() ? (
                    <span className="text-muted-foreground text-xs leading-snug">{sub.description}</span>
                  ) : null}
                </span>
              )

              return subHref ? (
                <Link
                  key={sub.id ?? subLabel}
                  href={subHref}
                  className="hover:bg-muted rounded-lg px-2 py-2"
                  {...(sub.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
                >
                  {inner}
                </Link>
              ) : (
                <div key={sub.id ?? subLabel} className="px-2 py-2">
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (!href && subItems.length === 0) {
    return <span className="text-sm font-medium">{label}</span>
  }

  return href ? (
    <Link
      href={href}
      className="hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium"
      {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
    >
      {icon ? <CmsMedia media={icon} cmsBaseUrl={cmsBaseUrl} alt="" className="size-5" width={20} height={20} /> : null}
      {label}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">{label}</span>
  )
}

export function HeaderBar({
  locale,
  cmsBaseUrl,
  siteName,
  logo,
  navigation,
  phones,
  rightLinks,
  authButtons,
}: HeaderBarProps) {
  const pathname = usePathname()
  const homeHref = getHomePath(locale)
  const loginLabel = authButtons?.loginDesktop?.trim() || 'Войти'
  const signupLabel = authButtons?.signupDesktop?.trim() || 'Регистрация'
  const loginMobile = authButtons?.loginMobile?.trim() || 'Вход'
  const signupMobile = authButtons?.signupMobile?.trim() || 'Регистрация'
  const otherLocale = locale === 'en' ? 'ru' : 'en'
  const otherHref = locale === 'en' ? pathname.replace(/^\/en/, '') || '/' : `/en${pathname === '/' ? '' : pathname}`

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      {phones.length > 0 || rightLinks.length > 0 ? (
        <div className="text-muted-foreground hidden border-b md:block">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-2">
            <div className="flex flex-wrap items-center gap-4">
              {phones.map((link, index) => (
                <TopbarLink key={link.id ?? `phone-${index}`} link={link} cmsBaseUrl={cmsBaseUrl} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {rightLinks.map((link, index) => (
                <TopbarLink key={link.id ?? `right-${index}`} link={link} cmsBaseUrl={cmsBaseUrl} />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-3">
        <Link href={homeHref} className="flex min-w-0 items-center gap-2">
          {logo ? (
            <CmsMedia
              media={logo}
              cmsBaseUrl={cmsBaseUrl}
              alt={siteName}
              className="h-9 w-auto max-w-40"
              width={160}
              height={36}
              priority
            />
          ) : (
            <span className="font-heading text-lg font-semibold tracking-tight">{siteName}</span>
          )}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {navigation.map((item, index) => (
            <NavLink
              key={item.id ?? `${item.label}-${index}`}
              item={item}
              locale={locale}
              cmsBaseUrl={cmsBaseUrl}
              surface="desktop"
            />
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" render={<Link href={otherHref} />}>
            {otherLocale.toUpperCase()}
          </Button>
          <Button variant="outline" size="sm" render={<Link href="#login" />}>
            {loginLabel}
          </Button>
          <Button size="sm" render={<Link href="#signup" />}>
            {signupLabel}
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Меню" />
              }
            >
              <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6">
              <SheetHeader>
                <SheetTitle>{siteName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {navigation.map((item, index) => (
                  <div key={item.id ?? `m-${index}`} className="flex flex-col gap-2">
                    <NavLink item={item} locale={locale} cmsBaseUrl={cmsBaseUrl} surface="mobile" />
                    {(item.subItems ?? []).map((sub) => {
                      const href = resolveHeaderNavDestHref(sub, locale)
                      const label = resolveNavSubItemLabelForSurface(sub, 'mobile')
                      if (!href || !label) {
                        return null
                      }
                      return (
                        <Link key={sub.id ?? label} href={href} className="text-muted-foreground pl-3 text-sm">
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2">
                <Button variant="outline" render={<Link href="#login" />}>
                  {loginMobile}
                </Button>
                <Button render={<Link href="#signup" />}>{signupMobile}</Button>
                <Button variant="ghost" render={<Link href={otherHref} />}>
                  {otherLocale.toUpperCase()}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
