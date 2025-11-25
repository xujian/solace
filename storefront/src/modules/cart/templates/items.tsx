import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, TableBody, TableHeader, TableRow, TableHead } from "@lib/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="pb-3 flex items-center">
        <h1 className="text-[2rem] leading-11">Cart</h1>
      </div>
      <Table>
        <TableHeader className="border-t-0">
          <TableRow className="text-ui-fg-subtle txt-medium-plus">
            <TableHead className="pl-0!">Item</TableHead>
            <TableHead></TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="hidden small:table-cell">
              Price
            </TableHead>
            <TableHead className="pr-0! text-right">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
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

export default ItemsTemplate
