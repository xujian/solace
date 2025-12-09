import { retrieveCart, listCartOptions } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import CartMismatchBanner from '@modules/layout/cart-mismatch-banner'
import FreeShippingPriceNudge from '@modules/shipping/free-shipping-price-nudge'
import { StoreCartShippingOption } from '@medusajs/types'

export default async function CartCustomerLayer() {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()

  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const cartOptions = await listCartOptions()

    if (cartOptions?.shipping_options) {
      shippingOptions = cartOptions.shipping_options
    }
  }

  return (
    <>
      {customer && cart && <CartMismatchBanner customer={customer} cart={cart} />}

      {cart && <FreeShippingPriceNudge variant="popup" cart={cart} shippingOptions={shippingOptions} />}
    </>
  )
}
