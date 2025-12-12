import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import CartView from '@modules/cart/view'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart'
}

export default async function CartPage() {
  const cart = await retrieveCart().catch(error => {
    console.error(error)
    return notFound()
  })

  // We still fetch cart to handle 404s or initial server-side hydration needs if we passed it,
  // but importantly we verify it exists.
  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return <CartView customer={customer} />
}
