import { Metadata } from 'next'
import { getBaseURL } from '@lib/util/env'
import Footer from '@modules/layout/footer'
import Nav from '@modules/layout/nav'
import CartCustomerLayer from '@modules/layout/cart-customer-layer'
import { Suspense } from 'react'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL())
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <CartCustomerLayer />
      </Suspense>
      <main className="page-body">{props.children}</main>
      <Footer />
    </>
  )
}
