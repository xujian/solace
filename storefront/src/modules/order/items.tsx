import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, TableBody } from "@lib/components/ui"

import { Separator } from "@lib/components/ui"
import Item from "@modules/order/item"
import SkeletonLineItem from "@modules/skeletons/skeleton-line-item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col">
      <Separator className="mb-0!" />
      <Table>
        <TableBody data-testid="products-table">
          {items?.length
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={order.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </TableBody>
      </Table>
    </div>
  )
}

export default Items
