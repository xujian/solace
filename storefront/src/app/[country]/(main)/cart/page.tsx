import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@lib/components/ui'
import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import EmptyCartMessage from '@modules/cart/components/empty-cart-message'
import SignInPrompt from '@modules/cart/components/sign-in-prompt'
import ItemsTemplate from '@modules/cart/templates/items'
import Summary from '@modules/cart/templates/summary'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart'
}

export default async function Cart() {
  const cart = await retrieveCart().catch(error => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()

  return (
    <div className="py-12">
      {cart?.items?.length ? (
        <div className="small:grid-cols-[1fr_360px] grid grid-cols-1 gap-x-40">
          <div className="flex flex-col gap-y-6 py-6">
            {!customer && (
              <>
                <SignInPrompt />
              </>
            )}
            <ItemsTemplate cart={cart} />
          </div>
          <div className="relative">
            <div className="sticky top-12 flex flex-col gap-y-8">
              {cart && cart.region && (
                <Summary cart={cart as any} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  )
}
