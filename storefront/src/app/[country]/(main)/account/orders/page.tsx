import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { listOrders } from '@lib/data/orders'
import TransferRequestForm from '@modules/account/transfer-request-form'
import OrderRow from '@modules/order/order-row'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Button } from '@lib/components/ui'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Overview of your previous orders.'
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <>
      <h1>Orders</h1>
      <p className="caption">
        View your previous orders and their status. You can also create returns or exchanges for your orders if
        needed.
      </p>
      <p>&nbsp;</p>
      <div className="flex w-full flex-col gap-y-8">
        {orders.map(o => (
          <div
            key={o.id}
            className="pb-6 last:border-none last:pb-0">
            <OrderRow order={o} />
          </div>
        ))}
      </div>
      {
        orders.length === 0 && (
          <div
            className="flex w-full flex-col items-center justify-center gap-y-4 min-h-100"
            data-testid="no-orders-view">
            <h2>Nothing to see here</h2>
            <p className="caption">
              You don&apos;t have any orders yet, let us change that
            </p>
            <div className="mt-4">
              <LocalizedClientLink href="/" passHref>
                <Button data-testid="continue-shopping-button">
                  Continue shopping
                </Button>
              </LocalizedClientLink>
            </div>
          </div>
        )
      }
      <TransferRequestForm />
    </>
  )
}
