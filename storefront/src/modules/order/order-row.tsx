'use client'

import { useMemo } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, Card, CardContent, CardHeader, Badge } from '@lib/components/ui'
import { convertToLocale } from '@lib/util/money'
import { useInteractive } from '@arsbreeze/interactive'
import OrderDetailsView from './order'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@lib/util'

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderRow = ({ order }: OrderCardProps) => {
  const $ = useInteractive()

  const openOrderDetails = () => {
    $.drawer(OrderDetailsView, { order: order.id }, { 
      title: `Order`
    })
  }

  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <Card className="order-item bg-muted" data-testid="order-item">
      <CardHeader>
        <div className='flex flex-row items-center gap-x-2'>
          <Badge>{order.display_id}</Badge>
          <div className="flex-1">
            <p>{order.id.toUpperCase()}</p>
            <p className="text-muted-foreground">
              {new Date(order.created_at).toDateString()}
            </p>
          </div>
          <div className='px-4'>
            
            <span data-testid="order-amount">
              Total: {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code})}
            </span>
          </div>
          <div>
            <Button 
              className='cursor-pointer' 
              data-testid="order-details-link"
              onClick={openOrderDetails}
            >
              Details
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-start gap-2">
        {order.items?.slice(0, 3).map(i => {
          return (
            <Link href={`/products/${i.product!.handle}`}
              key={i.id}
              className="flex items-center gap-x-2">
              <Image src={i.product!.thumbnail!} alt={i.product!.title} width={200} height={200}
                className={cn('aspect-square object-cover rounded-md w-16 h-16')} />
              <div className="flex-1">
                <p>{i.product!.title}</p>
                <p className="text-muted-foreground" data-testid="item-quantity">Quantity: {i.quantity}</p>
              </div>
              <div className="">
              </div>
            </Link>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-sm text-foreground">
              + {numberOfLines - 4}
            </span>
            <span className="text-sm text-foreground">more</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderRow
