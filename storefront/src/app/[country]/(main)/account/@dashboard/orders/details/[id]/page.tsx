import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveOrder } from '@lib/data/orders'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Help from '@modules/order/components/help'
import Items from '@modules/order/components/items'
import OrderDetails from '@modules/order/components/order-details'
import OrderSummary from '@modules/order/components/order-summary'
import ShippingDetails from '@modules/order/components/shipping-details'
import { X } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Order #${order.display_id}`,
    description: `View your order`
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl-semi">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="text-ui-fg-subtle hover:text-ui-fg-base flex items-center gap-2"
          data-testid="back-to-overview-button">
          <X /> Back to overview
        </LocalizedClientLink>
      </div>
      <div
        className="flex h-full w-full flex-col gap-4 bg-white"
        data-testid="order-details-container">
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}
