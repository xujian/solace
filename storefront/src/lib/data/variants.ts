"use server"

import { sdk } from '@lib/sdk'
import { HttpTypes } from "@medusajs/types"



export const retrieveVariant = async (
  variant_id: string
): Promise<HttpTypes.StoreProductVariant | null> => {




  return await sdk.client
    .fetch<{ variant: HttpTypes.StoreProductVariant }>(
      `/store/product-variants/${variant_id}`,
      {
        method: "GET",
        query: {
          fields: "*images",
        },
        next: { tags: ['variants'] }
      }
    )
    .then(({ variant }) => variant)
    .catch(() => null)
}
