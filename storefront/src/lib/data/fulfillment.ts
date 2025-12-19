'use server'

import { sdk } from '@lib/sdk'

export const listCartShippingMethods = async (cartId: string) => {
  console.log('Fetching shipping options for cartId:', cartId)
  return sdk.store.fulfillment
    .listCartOptions(
      { 
        cart_id: cartId,
      },
      {
        fields: '*service_zone.fulfillment_set',
        next: { tags: ['fulfillment'] }
      }
    )
    .then(({ shipping_options }) => {
      return shipping_options
    })
    .catch((e) => {
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
