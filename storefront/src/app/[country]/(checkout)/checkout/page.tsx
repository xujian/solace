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

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="small:grid-cols-[1fr_416px] content-container grid grid-cols-1 gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <div className="w-full grid grid-cols-1 gap-y-8">
          <Addresses cart={cart} customer={customer} />
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          <Review cart={cart} />
        </div>
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
