import { z } from 'zod'

export const bodySchema = z.object({
  deviceId: z.string().min(1),
  name: z.string().min(1),
  attending: z.enum(['yes', 'no']),
  guests: z.number().int().min(1).max(10),
})

export type BodySchema = z.infer<typeof bodySchema>
