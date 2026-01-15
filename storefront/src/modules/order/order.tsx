'use client'

import { HttpTypes } from '@medusajs/types'
import OrderDetails from '@modules/order/order-details'
import Items from '@modules/order/items'
import OrderSummary from '@modules/order/order-summary'
import ShippingDetails from '@modules/order/shipping-details'
import Help from '@modules/order/help'
import type { InteractiveContentProps } from '@arsbreeze/interactive'
import { retrieveOrder } from '@lib/data/orders'
import { useEffect, useState, useTransition } from 'react'
import { Skeleton } from '@lib/components/ui/skeleton'
import { AlertCircle, Package, ReceiptText, Truck } from 'lucide-react'
import { cn } from '@lib/util'

type OrderDetailsViewProps = {
  order: string
} & InteractiveContentProps

const OrderDetailsView = ({ order: id }: OrderDetailsViewProps) => {
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const res = await retrieveOrder(id)
        if (res) {
          setOrder(res)
        } else {
          setError('Order not found')
        }
      } catch (err) {
        setError('Failed to fetch order details')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (isLoading) {
    return (
      <div className="@container flex flex-col gap-y-8 h-full overflow-y-auto pr-4 -mr-4 animate-in fade-in duration-500">
        <section className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </section>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <section className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </section>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-y-4 text-center">
        <AlertCircle className="size-12 text-destructive/50" />
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-muted-foreground">{error || 'Could not find order'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-8 h-full overflow-y-auto pr-4 -mr-4 pb-8">
      <p className="caption">{order.id}</p>
      <section className="space-y-4">
        <div className="flex items-center gap-x-2 text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
          <ReceiptText className="size-4" />
          <h3>Summary</h3>
        </div>
        <OrderDetails order={order} showStatus />
      </section>
      <section className="space-y-4">
        <div className="flex items-center gap-x-2 text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
          <Package className="size-4" />
          <h3>Items</h3>
        </div>
        <div className="rounded-xl border bg-field/30 backdrop-blur-sm p-4 overflow-hidden">
          <Items order={order} />
        </div>
      </section>
      <section className='relative group'>
        <OrderSummary order={order} />
      </section>
      <section className="space-y-4">
        <div className="flex items-center gap-x-2 text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
          <Truck className="size-4" />
          <h3>Delivery</h3>
        </div>
        <ShippingDetails order={order} />
      </section>
      <section className="pt-4 border-t border-border/50">
        <Help />
      </section>
    </div>
  )
}

export default OrderDetailsView
