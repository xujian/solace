

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { Separator } from "@lib/components/ui"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <h2 className="flex flex-row text-3xl my-6">
        Payment
      </h2>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3">
              <p className="font-medium text-foreground mb-1">
                Payment method
              </p>
              <p
                className="text-base text-muted-foreground"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </p>
            </div>
            <div className="flex flex-col w-2/3">
              <p className="font-medium text-foreground mb-1">
                Payment details
              </p>
              <div className="flex gap-2 text-base text-muted-foreground items-center">
                <div className="flex items-center h-7 w-fit p-2 bg-muted/50 border rounded-md">
                  {paymentInfoMap[payment.provider_id].icon}
                </div>
                <p data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="mt-8" />
    </div>
  )
}

export default PaymentDetails
