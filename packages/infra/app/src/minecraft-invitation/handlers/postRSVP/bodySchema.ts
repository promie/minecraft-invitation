import { z } from 'zod'

export const bodySchema = z.object({
  name: z.string().min(1),
  attending: z.enum(['yes', 'no']),
  guests: z.number().int().min(0).max(10), // Allow 0 for "no" case
})

export type BodySchema = z.infer<typeof bodySchema>
