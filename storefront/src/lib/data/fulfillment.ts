"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.store.fulfillment.listCartOptions(
    { cart_id: cartId },
    {
      ...headers,
      next,
      cache: "force-cache",
    } as any
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

  const next = {
    ...(await getCacheOptions("fulfillment")),
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
      next,
    } as any
  )
  .then(({ shipping_option }) => shipping_option)
  .catch((e) => {
    return null
  })
}
