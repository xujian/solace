import { Metadata } from 'next'
import { StoreCartShippingOption } from '@medusajs/types'
import { listCartOptions, retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import { getBaseURL } from '@lib/util/env'
import CartMismatchBanner from '@modules/layout/cart-mismatch-banner'
import Footer from '@modules/layout/footer'
import Nav from '@modules/layout/nav'
import FreeShippingPriceNudge from '@modules/shipping/free-shipping-price-nudge'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL())
}

export default async function PageLayout(props: { children: React.ReactNode }) {
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
      <Nav />
      {customer && cart && <CartMismatchBanner customer={customer} cart={cart} />}

      {cart && <FreeShippingPriceNudge variant="popup" cart={cart} shippingOptions={shippingOptions} />}
      <main className="page-body max-w-8xl px-body mx-auto w-full">{props.children}</main>
      <Footer />
    </>
  )
}
