import { z } from 'zod'

import { cmsId } from './id'
import { mediaSchema } from './media'

const richTextSchema = z.unknown()

const legacyButtonSchema = z
  .object({
    text: z.union([z.string(), z.record(z.string(), z.unknown())]).nullable().optional(),
    url: z.string().nullable().optional(),
    isCustom: z.boolean().nullable().optional(),
    bgColor: z.string().nullable().optional(),
    textColor: z.string().nullable().optional(),
  })
  .nullable()
  .optional()

export const legacyHeroBlockSchema = z.object({
  id: z.string().optional(),
  blockType: z.literal('legacyHero'),
  blockName: z.string().nullable().optional(),
  title: z.string().optional(),
  icon: z.string().nullable().optional(),
  description: richTextSchema.optional(),
  image: z.union([cmsId, mediaSchema, z.record(z.string(), z.unknown())]).nullable().optional(),
  bgType: z.string().nullable().optional(),
  variation: z.string().nullable().optional(),
  imagePosition: z.string().nullable().optional(),
  titleSize: z.string().nullable().optional(),
  titleTheme: z.string().nullable().optional(),
  headerLevel: z.string().nullable().optional(),
  blockBgColor: z.string().nullable().optional(),
  blockTextColor: z.string().nullable().optional(),
  primaryButton: legacyButtonSchema,
  secondaryButton: legacyButtonSchema,
})

export const homePageBlockSchema = legacyHeroBlockSchema

export const homePageSchema = z.object({
  id: cmsId.optional(),
  title: z.string().nullable().optional(),
  showTitle: z.boolean().nullable().optional(),
  blocks: z.array(homePageBlockSchema).nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  globalType: z.literal('homePage').optional(),
})

export function isLegacyPromoBlock(
  block: { blockType?: string } | null | undefined,
): block is z.infer<typeof legacyHeroBlockSchema> {
  return block?.blockType === 'legacyHero'
}

export type LegacyHeroBlockInput = z.infer<typeof legacyHeroBlockSchema>
export type HomePageInput = z.infer<typeof homePageSchema>
