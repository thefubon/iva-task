import { z } from 'zod'

export const cmsId = z.union([z.string(), z.number()])

export type CmsId = z.infer<typeof cmsId>
