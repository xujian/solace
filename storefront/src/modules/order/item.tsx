import { HttpTypes } from "@medusajs/types"

import LineItemOptions from "@modules/cart/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/thumbnail"

type ItemProps = {
  data: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ data, currencyCode }: ItemProps) => {
  return (
    <div className="flex items-center justify-between gap-4" data-testid="product-row">
      <div className="w-24">
        <Thumbnail thumbnail={data.thumbnail} size="square" />
      </div>
      <div className="flex-1 text-left">
        <p
          className="text-base font-medium text-foreground"
          data-testid="product-name">
          {data.product_title}
        </p>
        <LineItemOptions variant={data.variant} data-testid="product-variant" />
      </div>
      <div className="flex flex-col items-end h-full justify-center">
        <div className="flex gap-x-1 ">
          <p className="text-muted-foreground">
            <span data-testid="product-quantity">{data.quantity}</span>x{" "}
          </p>
          <LineItemUnitPrice
            item={data}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
        <LineItemPrice
          item={data}
          style="tight"
          currencyCode={currencyCode}
        />
      </div>
    </div>
  )
}

export default Item
