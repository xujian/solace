import repeat from '@lib/util/repeat'
import { Separator, Table, TableBody } from '@lib/components/ui'
import Item from '@modules/cart/item'
import DiscountCode from '@modules/checkout/discount-code'
import CartTotals from '@modules/common/components/cart-totals'
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item'

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="small:flex-col small:py-0 sticky top-0 flex flex-col-reverse gap-y-8 py-8">
      <div className="flex w-full flex-col bg-white">
        <Separator className="small:hidden my-6" />
        <Separator className="small:hidden my-6" />
        <h2 className="text-3xl-regular flex flex-row items-baseline">
          In your Cart
        </h2>
        <CartTotals totals={cart} />
        <Table>
          <TableBody data-testid="items-table">
            {cart.items
              ? cart.items
                  .sort((a, b) => {
                    return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
                  })
                  .map(item => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        type="preview"
                        currencyCode={cart.currency_code}
                      />
                    )
                  })
              : repeat(5).map(i => {
                  return <SkeletonLineItem key={i} />
                })}
          </TableBody>
        </Table>
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
