'use server'

import { HttpTypes } from '@medusajs/types'
import { sdk } from '@lib/sdk'

export const listCartPaymentMethods = async (regionId: string) => {
  return sdk.store.payment.listPaymentProviders(
      { region_id: regionId }
    )
    .then((res) =>
      res.payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}
