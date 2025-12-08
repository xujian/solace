import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@lib/components/ui'
import { Button } from '@lib/components/ui'
import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import { HttpTypes } from "@medusajs/types"
import { Table, TableBody, TableHeader, TableRow, TableHead } from "@lib/components/ui"
import repeat from "@lib/util/repeat"
import EmptyCartMessage from '@modules/cart/empty-cart-message'
import SignInPrompt from '@modules/cart/sign-in-prompt'
import Item from "@modules/cart/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import DiscountCode from '@modules/checkout/components/discount-code'
import CartTotals from '@modules/common/components/cart-totals'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart'
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return 'address'
  } else if (cart?.shipping_methods?.length === 0) {
    return 'delivery'
  } else {
    return 'payment'
  }
}

export default async function Cart() {
  const cart = await retrieveCart().catch(error => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()
  const step = cart ? getCheckoutStep(cart) : 'address'

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
            <div>
              <div className="pb-3 flex items-center">
                <h1 className="text-[2rem] leading-11">Cart</h1>
              </div>
              <Table>
                <TableHeader className="border-t-0">
                  <TableRow className="text-ui-fg-subtle txt-medium-plus">
                    <TableHead className="pl-0!">Item</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden small:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="pr-0! text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items
                    ? cart.items
                        .sort((a, b) => {
                          return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                        })
                        .map((item) => {
                          return (
                            <Item
                              key={item.id}
                              item={item}
                              currencyCode={cart?.currency_code}
                            />
                          )
                        })
                    : repeat(5).map((i) => {
                        return <SkeletonLineItem key={i} />
                      })}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="relative">
            <div className="sticky top-12 flex flex-col gap-y-8">
              {cart && cart.region && (
                <div className="flex flex-col gap-y-4">
                  <DiscountCode cart={cart as any} />
                  <CartTotals totals={cart} />
                  <LocalizedClientLink
                    href={'/checkout?step=' + step}
                    data-testid="checkout-button">
                    <Button className="h-10 w-full">Go to checkout</Button>
                  </LocalizedClientLink>
                </div>
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
