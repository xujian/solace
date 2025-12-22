import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code
    })
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <span>Subtotal</span>
        <span>{getAmount(order.subtotal)}</span>
      </div>
      <div className="flex flex-col gap-y-1">
        {order.discount_total > 0 && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>- {getAmount(order.discount_total)}</span>
          </div>
        )}
        {order.gift_card_total > 0 && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>- {getAmount(order.gift_card_total)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>{getAmount(order.shipping_total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes</span>
          <span>{getAmount(order.tax_total)}</span>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b border-dashe" />
      <div className="tmb-2 flex items-center justify-between">
        <span>Total</span>
        <span>{getAmount(order.total)}</span>
      </div>
    </>
  )
}

export default OrderSummary
