import type {} from 'payload'

export type { User, Media, HomePage, Header, Config } from './payload-types'

export {
  locales,
  defaultLocale,
  fallbackLocale,
  isAppLocale,
  resolveLocaleParam,
  buildPayloadLocaleQuery,
  type AppLocale,
} from './i18n'

export { cmsEnvSchema, webEnvSchema, parseCmsEnv, parseWebEnv, type CmsEnv, type WebEnv } from './schemas'

export { sanitizeHref, isSafeHref } from './safe-href'
export { localizeAppHref } from './localized-href'

export {
  legacyHeroBlockSchema,
  homePageBlockSchema,
  homePageSchema,
  isLegacyPromoBlock,
  type LegacyHeroBlockInput,
  type HomePageInput,
} from './schemas/home-page'

export {
  headerSchema,
  headerNavItemSchema,
  headerNavSubItemSchema,
  headerAuthButtonsSchema,
  topbarLinkSchema,
  type HeaderInput,
  type HeaderNavItemInput,
  type HeaderNavSubItemInput,
  type HeaderAuthButtonsInput,
  type TopbarLinkInput,
} from './schemas/header'

export { cmsId, type CmsId } from './schemas/id'
export { mediaSchema, type MediaInput } from './schemas/media'
export { hexColorSchema, type HexColorInput } from './schemas/color'
