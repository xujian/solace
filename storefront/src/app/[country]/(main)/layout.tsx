import { Metadata } from 'next'
import { Suspense } from 'react'
import { InteractiveProvider } from '@arsbreeze/interactive'
import { CartProvider } from '@lib/context/cart-context'
import { retrieveCart } from '@lib/data/cart'
import { getBaseURL } from '@lib/util/env'
import CartCustomerLayer from '@modules/layout/cart-customer-layer'
import Footer from '@modules/layout/footer'
import Nav from '@modules/layout/nav'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL())
}

export default async function PageLayout(props: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const cart = await retrieveCart()

  return (
    <InteractiveProvider>
      <CartProvider data={cart}>
        <Nav />
        <Suspense fallback={null}>
          <CartCustomerLayer />
        </Suspense>
        <main className="page-body">{props.children}</main>
        {props.modal}
        <Footer />
      </CartProvider>
    </InteractiveProvider>
  )
}
