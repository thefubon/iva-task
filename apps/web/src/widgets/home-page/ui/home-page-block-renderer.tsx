import type { LegacyHeroBlockInput } from '@iva360/shared'

import { LegacyHeroBlock } from '@/widgets/legacy-promo/ui/legacy-hero-block'

type HomePageBlockRendererProps = {
  block: LegacyHeroBlockInput
  cmsBaseUrl: string
  isLeadingBlock?: boolean
}

export function getHomePageBlockKey(block: { id?: string; blockType: string }, index: number): string {
  return block.id ? `${block.blockType}-${block.id}` : `${block.blockType}-${index}`
}

export function HomePageBlockRenderer({
  block,
  cmsBaseUrl,
  isLeadingBlock = false,
}: HomePageBlockRendererProps) {
  if (block.blockType !== 'legacyHero') {
    return null
  }

  return <LegacyHeroBlock block={block} cmsBaseUrl={cmsBaseUrl} priority={isLeadingBlock} />
}
