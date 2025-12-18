import { Metadata } from 'next'
import { getBaseURL } from '@lib/util/env'
import Footer from '@modules/layout/footer'
import Nav from '@modules/layout/nav'
import CartCustomerLayer from '@modules/layout/cart-customer-layer'
import { Suspense } from 'react'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL())
}

import { retrieveCart } from '@lib/data/cart'
import { CartProvider } from '@lib/context/cart-context'

export default async function PageLayout(props: 
  { 
    children: React.ReactNode,
    modal: React.ReactNode
  }) {
  const cart = await retrieveCart()

  return (
    <CartProvider data={cart}>
      <Nav />
      <Suspense fallback={null}>
        <CartCustomerLayer />
      </Suspense>
      <main className="page-body">{props.children}</main>
      {props.modal}
      <Footer />
    </CartProvider>
  )
}
