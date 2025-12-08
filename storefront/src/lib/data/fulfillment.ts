"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.fulfillment.listCartOptions(
    { cart_id: cartId },
    {
      ...headers,
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
  const headers = {
    ...(await getAuthHeaders()),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.store.fulfillment.calculate(
    optionId,
    body,
    undefined,
    {
      ...headers,
      next: { tags: ['fulfillment'] },
    }
  )
  .then(({ shipping_option }) => shipping_option)
  .catch((e) => {
    return null
  })
}
