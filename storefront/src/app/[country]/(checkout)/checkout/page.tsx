import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import PaymentWrapper from '@modules/checkout/payment-wrapper'
import CheckoutSummary from '@modules/checkout/checkout-summary'
import Addresses from "@modules/checkout/addresses"
import Payment from "@modules/checkout/payment"
import Review from "@modules/checkout/review"
import Shipping from "@modules/checkout/shipping"
import PaymentButton from '@modules/checkout/payment-button'

export const metadata: Metadata = {
  title: 'Checkout'
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  console.log('paymentMethods', paymentMethods)

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods?.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PaymentWrapper cart={cart}>
        <div className="w-full grid grid-cols-1 gap-y-8">
          <Addresses cart={cart} customer={customer} />
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </div>
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
