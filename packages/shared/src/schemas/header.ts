import { z } from 'zod'

import { cmsId } from './id'
import { mediaSchema } from './media'

export const headerNavLinkSourceSchema = z.enum(['page', 'manual'])

export const headerNavPageRefSchema = z.union([
  cmsId,
  z.object({
    id: cmsId,
    slug: z.string(),
    pathname: z.string().nullable().optional(),
  }),
])

export const headerNavLinkFieldsSchema = {
  linkSource: headerNavLinkSourceSchema.nullable().optional(),
  page: headerNavPageRefSchema.nullable().optional(),
  url: z.string().nullable().optional(),
}

export const headerNavSubItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  mobileLabel: z.string().nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
  description: z.string().nullable().optional(),
  hoverBackground: z.string().nullable().optional(),
  titleColor: z.string().nullable().optional(),
  icon: z.union([cmsId, mediaSchema]).nullable().optional(),
  mobileIcon: z.union([cmsId, mediaSchema]).nullable().optional(),
  ...headerNavLinkFieldsSchema,
})

export const headerNavItemSchema = z.object({
  id: z.string().optional(),
  icon: z.union([cmsId, mediaSchema]).nullable().optional(),
  mobileIcon: z.union([cmsId, mediaSchema]).nullable().optional(),
  mobileMenuOnly: z.boolean().nullable().optional(),
  label: z.string().optional(),
  mobileLabel: z.string().nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
  subItems: z.array(headerNavSubItemSchema).nullable().optional(),
  ...headerNavLinkFieldsSchema,
})

export const headerAuthButtonsSchema = z
  .object({
    loginDesktop: z.string().nullable().optional(),
    signupDesktop: z.string().nullable().optional(),
    loginMobile: z.string().nullable().optional(),
    signupMobile: z.string().nullable().optional(),
  })
  .nullable()
  .optional()

export const topbarLinkSchema = z.object({
  id: z.string().optional(),
  number: z.string().optional(),
  url: z.string().nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
  iconType: z.enum(['none', 'hugeicons', 'custom']).nullable().optional(),
  hugeiconsName: z.string().nullable().optional(),
  customIcon: z.union([cmsId, mediaSchema]).nullable().optional(),
})

export const headerSchema = z.object({
  id: cmsId.optional(),
  logo: z.union([cmsId, mediaSchema]).nullable().optional(),
  siteName: z.string().nullable().optional(),
  authButtons: headerAuthButtonsSchema,
  navigation: z.array(headerNavItemSchema).nullable().optional(),
  phones: z.array(topbarLinkSchema).nullable().optional(),
  rightLinks: z.array(topbarLinkSchema).nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  globalType: z.literal('header').optional(),
})

export type HeaderNavLinkSource = z.infer<typeof headerNavLinkSourceSchema>
export type HeaderNavPageRef = z.infer<typeof headerNavPageRefSchema>
export type HeaderNavSubItemInput = z.infer<typeof headerNavSubItemSchema>
export type HeaderNavItemInput = z.infer<typeof headerNavItemSchema>
export type HeaderAuthButtonsInput = NonNullable<z.infer<typeof headerAuthButtonsSchema>>
export type TopbarLinkInput = z.infer<typeof topbarLinkSchema>
export type HeaderInput = z.infer<typeof headerSchema>
