'use client'

import { HttpTypes } from '@medusajs/types'
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  Button
} from '@lib/components/ui'
import repeat from '@lib/util/repeat'
import EmptyCartMessage from '@modules/cart/empty-cart-message'
import Item from '@modules/cart/item'
import SignInPrompt from '@modules/cart/sign-in-prompt'
import DiscountCode from '@modules/checkout/discount-code'
import CartTotals from '@modules/common/components/cart-totals'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import SkeletonLineItem from '@modules/skeletons/skeleton-line-item'
import { useCart } from '@lib/context/cart-context'

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return 'address'
  } else if (cart?.shipping_methods?.length === 0) {
    return 'delivery'
  } else {
    return 'payment'
  }
}

export default function CartTemplate({
  customer
}: {
  customer: HttpTypes.StoreCustomer | null
}) {
  const { cart } = useCart()

  return (
    <div className="cart-page">
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {!customer && <SignInPrompt />}
          <div className="flex flex-col gap-y-6 py-6">
            <div className="flex items-center pb-3">
              <h1 className="text-[2rem] leading-11">Cart</h1>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="small:table-cell hidden">
                    Price
                  </TableHead>
                  <TableHead className="pr-0! text-right">Total</TableHead>
                  <TableHead className="pr-0! text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="gap-4">
                {cart.items
                  ? cart.items
                      .sort((a, b) => {
                        return (a.created_at ?? '') > (b.created_at ?? '')
                          ? -1
                          : 1
                      })
                      .map(item => {
                        return (
                          <Item
                            key={item.id}
                            item={item}
                            currencyCode={cart?.currency_code}
                          />
                        )
                      })
                  : repeat(5).map(i => {
                      return <SkeletonLineItem key={i} />
                    })}
              </TableBody>
            </Table>
            {cart && cart.region && (
              <div className="flex flex-col gap-y-4">
                <DiscountCode cart={cart as any} />
                <CartTotals totals={cart} />
                <LocalizedClientLink
                  href={'/checkout?step=' + getCheckoutStep(cart)}
                  data-testid="checkout-button">
                  <Button className="w-full">Go to checkout</Button>
                </LocalizedClientLink>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  )
}
