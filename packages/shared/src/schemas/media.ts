import { z } from 'zod'

import { cmsId } from './id'

export const mediaSchema = z.object({
  id: cmsId,
  alt: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  url: z.string().nullable().optional(),
  thumbnailURL: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  filesize: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
})

export type MediaInput = z.infer<typeof mediaSchema>
