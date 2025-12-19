'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { HttpTypes, StoreRegion } from '@medusajs/types'
import medusaError from '@lib/util/medusa-error'
import { sdk } from '@lib/sdk'
import { getCartId, removeCartId, setCartId } from './cookies'
import { getRegion } from './regions'

const DEFAULT_CART_FIELDS = [
  'id',
  'email',
  'currency_code',
  'region_id',
  'customer_id',
  'status',
  'type',
  'metadata',
  'created_at',
  'updated_at',
  'shipping_address.*',
  'billing_address.*',
  'items.id',
  'items.quantity',
  'items.variant_id',
  'items.thumbnail',
  'items.title',
  'items.unit_price',
  'items.product.id',
  'items.product.title',
  'items.product.handle',
  'items.variant.id',
  'items.variant.title',
  'items.variant.sku',
  'region.id',
  'region.name',
  'region.currency_code',
  'shipping_methods.*',
  // 'shipping_methods.name',
  // 'shipping_methods.amount',
  'payment_collection.id',
  'payment_collection.amount',
  'payment_collection.payment_sessions',
  // 'gift_cards.id',
  // 'gift_cards.code',
  // 'gift_cards.amount',
  'total',
  'subtotal',
  'tax_total',
  'discount_total',
  'shipping_total',
  'gift_card_total'
].join(',')

//*items, *region, *items.product, *items.variant, 
// *items.thumbnail, *items.metadata, +items.total, 
// *promotions, 
// +shipping_methods.name

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId())
  fields ??= DEFAULT_CART_FIELDS
  if (!id) {
    return null
  }
  return await sdk.store.cart
    .retrieve(
      id,
      {
        fields
      },
      {
        next: { tags: ['cart'] }
      }
    )
    .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(regionCode: string) {
  const region = await getRegion(regionCode)
  if (!region) {
    throw new Error(`Region not found for region code: ${regionCode}`)
  }
  let cart = await retrieveCart(undefined, 'id,region_id')
  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      { fields: 'id,region_id' }
    )
    cart = cartResp.cart
    await setCartId(cart.id)
    revalidateTag('cart', 'max')
  }
  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id })
    revalidateTag('cart', 'max')
  }
  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('No existing cart found, please create one before updating')
  }
  return sdk.store.cart
    .update(cartId, data)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      console.log('[][][][][][]cart', cart)
      revalidateTag('cart', 'max')
      revalidateTag('fulfillment', 'max')
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  region
}: {
  variantId: string
  quantity: number
  region: StoreRegion
}) {
  if (!variantId) {
    throw new Error('Missing variant ID when adding to cart')
  }
  const cart = await getOrSetCart(region.id)
  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }
  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity
      },
    )
    .then(async () => {
      revalidateTag('cart', 'max')
      revalidateTag('fulfillment', 'max')
    })
    .catch(medusaError)
}

export async function updateLineItem({
  lineId,
  quantity
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error('Missing lineItem ID when updating line item')
  }
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('Missing cart ID when updating line item')
  }
  await sdk.store.cart
    .updateLineItem(
      cartId,
      lineId,
      { quantity },
      { fields: DEFAULT_CART_FIELDS }
    )
    .then(async () => {
      revalidateTag('cart', 'max')
      revalidateTag('fulfillment', 'max')
    })
    .catch(medusaError)
}

export async function deleteItem(lineId: string) {
  if (!lineId) {
    throw new Error('Missing lineItem ID when deleting line item')
  }
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('Missing cart ID when deleting line item')
  }
  await sdk.store.cart
    .deleteLineItem(cartId, lineId, { fields: DEFAULT_CART_FIELDS })
    .then(async () => {
      revalidateTag('cart', 'max')
      revalidateTag('fulfillment', 'max')
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId
}: {
  cartId: string
  shippingMethodId: string
}) {
  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId })
    .then(async () => {
      revalidateTag('cart', 'max')
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  return sdk.store.payment
    .initiatePaymentSession(cart, data)
    .then(async resp => {
      revalidateTag('cart', 'max')
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('No existing cart found')
  }
  return sdk.store.cart
    .update(cartId, { promo_codes: codes })
    .then(async () => {
      revalidateTag('cart', 'max')
      revalidateTag('fulfillment', 'max')
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get('code') as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  console.log('/////////////////////setAddresses', formData)
  try {
    if (!formData) {
      throw new Error('No form data found when setting addresses')
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error('No existing cart found when setting addresses')
    }
    const data: any = {
      shipping_address: {
        first_name: formData.get('shipping_address.first_name'),
        last_name: formData.get('shipping_address.last_name'),
        address_1: formData.get('shipping_address.address_1'),
        address_2: '',
        company: formData.get('shipping_address.company'),
        postal_code: formData.get('shipping_address.postal_code'),
        city: formData.get('shipping_address.city'),
        country_code: formData.get('shipping_address.country_code'),
        province: formData.get('shipping_address.province'),
        phone: formData.get('shipping_address.phone')
      },
      email: formData.get('email')
    }

    const sameAsBilling = formData.get('same_as_billing')
    if (sameAsBilling === 'on') data.billing_address = data.shipping_address

    if (sameAsBilling !== 'on')
      data.billing_address = {
        first_name: formData.get('billing_address.first_name'),
        last_name: formData.get('billing_address.last_name'),
        address_1: formData.get('billing_address.address_1'),
        address_2: '',
        company: formData.get('billing_address.company'),
        postal_code: formData.get('billing_address.postal_code'),
        city: formData.get('billing_address.city'),
        country_code: formData.get('billing_address.country_code'),
        province: formData.get('billing_address.province'),
        phone: formData.get('billing_address.phone')
      } as any
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get('shipping_address.country_code')}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())
  if (!id) {
    throw new Error('No existing cart found when placing an order')
  }
  const cartRes = await sdk.store.cart
    .complete(id)
    .then(async cartRes => {
      revalidateTag('cart', 'max')
      return cartRes
    })
    .catch(medusaError)
  if (cartRes?.type === 'order') {
    const region = cartRes.order.shipping_address?.country_code?.toLowerCase()
    revalidateTag('orders', 'max')
    removeCartId()
    redirect(`/${region}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the region param and revalidates the regions cache
 * @param code
 * @param currentPath
 */
export async function updateRegion(code: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(code)
  if (!region) {
    throw new Error(`Region not found for region code: ${code}`)
  }
  if (cartId) {
    await updateCart({ region_id: region.id })
    revalidateTag('cart', 'max')
  }
  revalidateTag('regions', 'max')
  revalidateTag('products', 'max')
  redirect(`/${code}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  if (!cartId) {
    return null
  }
  return await sdk.store.fulfillment
    .listCartOptions(
      { cart_id: cartId },
      {
        next: { tags: ['shippingOptions'] }
      }
    )
    .then(({ shipping_options }) => ({ shipping_options }))
}
