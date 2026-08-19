import { resolveLocaleParam, type AppLocale } from '@iva360/shared'

import { fetchHeader } from '@/shared/api/cms-globals'
import { getCmsPublicUrl } from '@/shared/lib/cms-url'

import { getHeaderNavigation } from './lib/get-header-navigation'
import { HeaderBar } from './ui/header-bar'

type HeaderProps = {
  locale: AppLocale | string
}

export async function Header({ locale }: HeaderProps) {
  const resolved = resolveLocaleParam(locale)
  const header = await fetchHeader(resolved)
  const cmsBaseUrl = getCmsPublicUrl()

  return (
    <HeaderBar
      locale={resolved}
      cmsBaseUrl={cmsBaseUrl}
      siteName={header?.siteName?.trim() || 'IVA 360'}
      logo={header?.logo}
      navigation={getHeaderNavigation(header?.navigation, resolved)}
      phones={header?.phones ?? []}
      rightLinks={header?.rightLinks ?? []}
      authButtons={header?.authButtons ?? null}
    />
  )
}
