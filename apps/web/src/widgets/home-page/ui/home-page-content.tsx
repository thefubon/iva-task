import type { AppLocale, HomePageInput } from '@iva360/shared'

import { getCmsPublicUrl } from '@/shared/lib/cms-url'

import { getHomePageBlockKey, HomePageBlockRenderer } from './home-page-block-renderer'

type HomePageContentProps = {
  homePage: HomePageInput | null
  locale?: AppLocale
}

export function HomePageContent({ homePage, locale = 'ru' }: HomePageContentProps) {
  const blocks = homePage?.blocks
  const pageTitle = homePage?.title?.trim()
  const showTitle = Boolean(homePage?.showTitle) && Boolean(pageTitle)
  const cmsBaseUrl = getCmsPublicUrl()

  if (!blocks?.length) {
    if (showTitle && pageTitle) {
      return (
        <main className="mx-auto w-full max-w-6xl px-6 py-16">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">{pageTitle}</h1>
        </main>
      )
    }

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-16">
        <p className="text-muted-foreground text-sm">IVA 360 · Главная</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Страница ещё пустая</h1>
        <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
          Добавьте Legacy Hero в{' '}
          <a className="text-primary underline-offset-4 hover:underline" href="/admin/globals/homePage">
            CMS → Главная
          </a>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="flex w-full flex-col gap-12 py-12 md:gap-16 md:py-16">
      {showTitle && pageTitle ? (
        <div className="mx-auto w-full max-w-6xl px-6">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">{pageTitle}</h1>
        </div>
      ) : null}
      {blocks.map((block, index) => (
        <HomePageBlockRenderer
          key={getHomePageBlockKey(block, index)}
          block={block}
          cmsBaseUrl={cmsBaseUrl}
          isLeadingBlock={index === 0}
        />
      ))}
    </main>
  )
}
