import { z } from 'zod'

export const bodySchema = z.object({
  guests: z.number().int().min(1).max(10),
})

export type BodySchema = z.infer<typeof bodySchema>

