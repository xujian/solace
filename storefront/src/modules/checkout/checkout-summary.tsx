import { Separator, Table, TableBody } from '@lib/components/ui'
import repeat from '@lib/util/repeat'
import Item from '@modules/cart/item'
import DiscountCode from '@modules/checkout/discount-code'
import CartTotals from '@modules/common/components/cart-totals'
import SkeletonLineItem from '@modules/skeletons/skeleton-line-item'

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="flex w-full flex-col">
      <h2>In your Cart</h2>
      <CartTotals totals={cart} />
      <Table>
        <TableBody data-testid="items-table">
          {cart.items
            ? cart.items
                .sort((a, b) => {
                  return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
                })
                .map(item => {
                  return <tr key={item.id}></tr>
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
  )
}

export default CheckoutSummary
