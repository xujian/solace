import { retrieveOrder } from '@lib/data/orders'
import CartTotals from '@modules/common/components/cart-totals'
import Help from '@modules/order/help'
import Items from '@modules/order/items'
import OnboardingCta from '@modules/order/onboarding-cta'
import OrderDetails from '@modules/order/order-details'
import PaymentDetails from '@modules/order/payment-details'
import ShippingDetails from '@modules/order/shipping-details'
import { Metadata } from 'next'
import { cookies as nextCookies } from 'next/headers'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'You purchase was successful'
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  const cookies = await nextCookies()
  const isOnboarding = cookies.get('_medusa_onboarding')?.value === 'true'

  return (
    <div className="order-confirmed-page">
      {isOnboarding && <OnboardingCta orderId={order.id} />}
      <div
        className="flex h-full w-full max-w-4xl flex-col gap-4 py-10"
        data-testid="order-complete-container">
        <h1>Thank you!</h1>
        <p className="text-sm text-muted-foreground">Your order was placed successfully.</p>
        <OrderDetails order={order} />
        <h2 className="text-3xl flex flex-row">Summary</h2>
        <Items order={order} />
        <CartTotals totals={order} />
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
        <Help />
      </div>
    </div>
  )
}
