export {
  cmsEnvSchema,
  webEnvSchema,
  parseCmsEnv,
  parseWebEnv,
  type CmsEnv,
  type WebEnv,
} from './env'

export {
  legacyHeroBlockSchema,
  homePageBlockSchema,
  homePageSchema,
  isLegacyPromoBlock,
  type LegacyHeroBlockInput,
  type HomePageInput,
} from './home-page'

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
} from './header'

export { cmsId, type CmsId } from './id'
export { mediaSchema, type MediaInput } from './media'
export { hexColorSchema, type HexColorInput } from './color'
