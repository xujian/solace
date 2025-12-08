'use server'

import { sdk } from '@lib/config'

export const listCartShippingMethods = async (cartId: string) => {
  return sdk.store.fulfillment
    .listCartOptions(
      { cart_id: cartId },
      {
        next: { tags: ['fulfillment'] }
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const body: any = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.store.fulfillment
    .calculate(optionId, body, undefined, {
      next: { tags: ['fulfillment'] }
    })
    .then(({ shipping_option }) => shipping_option)
    .catch(e => {
      return null
    })
}
