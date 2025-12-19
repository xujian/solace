import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import { listCartShippingMethods } from '@lib/data/fulfillment'
import { listCartPaymentMethods } from '@lib/data/payment'
import Addresses from '@modules/checkout/addresses'
import CheckoutSummary from '@modules/checkout/checkout-summary'
import Payment from '@modules/checkout/payment'
import PaymentButton from '@modules/checkout/payment-button'
import PaymentWrapper from '@modules/checkout/payment-wrapper'
import Shipping from '@modules/checkout/shipping'

export const metadata: Metadata = {
  title: 'Checkout'
}

export default async function CheckoutPage() {
  const cart = await retrieveCart()

  console.log('<><><><><><><><>cart', cart)

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const shippingMethods = await listCartShippingMethods(cart.id)
  console.log('--- CheckoutPage: cart.shipping_address', cart.shipping_address)
  console.log('--- CheckoutPage: cart.region', cart.region)
  console.log('--- CheckoutPage: shippingMethods', JSON.stringify(shippingMethods, null, 2))
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? '')
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <PaymentWrapper cart={cart}>
        <div className="grid w-full grid-cols-1 gap-y-4">
          <Addresses cart={cart} customer={customer} />
          <Shipping cart={cart} methods={shippingMethods} />
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </div>
      </PaymentWrapper>
      <div className="relative block">
        <div className="sticky top-16 rounded bg-muted px-4">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
