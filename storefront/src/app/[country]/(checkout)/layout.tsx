import { CartProvider } from '@lib/context/cart-context'
import { retrieveCart } from '@lib/data/cart'
import Nav from '@modules/layout/nav'

export default async function CheckoutLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cart = await retrieveCart()
  return (
    <CartProvider data={cart}>
      <Nav minimal />
      <main className="page-body" data-testid="checkout-container">
        {children}
      </main>
    </CartProvider>
  )
}
