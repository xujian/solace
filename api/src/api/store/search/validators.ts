import { createFindParams } from '@medusajs/medusa/api/utils/validators'
import { z } from 'zod'

export const SearchParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    currency: z.string(),
    collection: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
    material: z.array(z.string()).optional(),
    sort: z
      .enum([
        'relevance',
        'calculated_price',
        '-calculated_price',
        'created_at',
        '-created_at',
      ])
      .default('relevance'),
    price: z.array(z.coerce.number()).optional(),
  })
)

export type SearchParams = z.infer<
  typeof SearchParams
>
