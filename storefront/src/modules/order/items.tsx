import { HttpTypes } from '@medusajs/types'
import repeat from '@lib/util/repeat'
import SkeletonLineItem from '@modules/skeletons/skeleton-line-item'
import Item from '@modules/order/item'
import Link from 'next/link'

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col gap-y-2">
      <Link href={`/products/${order.items?.[0].product?.handle}`}>
      {items?.length
        ? items
            .sort((a, b) => {
              return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
            })
            .map(item => {
              return (
                <Item
                  key={item.id}
                  data={item}
                  currencyCode={order.currency_code}
                />
              )
            })
        : repeat(5).map(i => {
            return <SkeletonLineItem key={i} />
          })}
      </Link>
    </div>
  )
}

export default Items
