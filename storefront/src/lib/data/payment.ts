'use server'

import { HttpTypes } from '@medusajs/types'
import { sdk } from '@lib/sdk'

export const listCartPaymentMethods = async (regionId: string) => {
  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: 'GET',
        query: { region_id: regionId },
        next: { tags: ['payment_providers'] }
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}
