import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveOrder } from '@lib/data/orders'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Help from '@modules/order/help'
import Items from '@modules/order/items'
import OrderDetails from '@modules/order/order-details'
import OrderSummary from '@modules/order/order-summary'
import ShippingDetails from '@modules/order/shipping-details'
import { X } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator, BreadcrumbLink } from '@lib/components/ui'

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
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/account">Account</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/account/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Details</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Order details</h1>
      <p className="caption">We have sent the order confirmation details to{" "}
        <span
          className="text-primary"
          data-testid="order-email">
          {order.email}
        </span>
      </p>
      <p>&nbsp;</p>
      <h2 className="mt-8">Order Summary</h2>
      <OrderDetails order={order} showStatus />
      <p>&nbsp;</p>
      <h2 className="mt-8">Items</h2>
      <Items order={order} />
      <p>&nbsp;</p>
      <OrderSummary order={order} />
      <p>&nbsp;</p>
      <h2 className="mt-8">Delivery</h2>
      <ShippingDetails order={order} />
      <p>&nbsp;</p>
      <Help />
    </>
  )
}
