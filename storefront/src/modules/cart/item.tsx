'use client'

import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Select, Spinner, TableCell, TableRow } from '@lib/components/ui'
import { updateLineItem } from '@lib/data/cart'
import { cn } from '@lib/util'
import ErrorMessage from '@modules/checkout/error-message'
import DeleteButton from '@modules/cart/delete-button'
import LineItemOptions from '@modules/cart/line-item-options'
import LineItemPrice from '@modules/common/components/line-item-price'
import LineItemUnitPrice from '@modules/common/components/line-item-unit-price'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Thumbnail from '@modules/products/thumbnail'
import Quantity from '@modules/cart/quantity'
import { useCart } from '@lib/context/cart-context'

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: 'full' | 'preview'
  currencyCode: string
}

const Item = ({ item: initialItem, type = 'full', currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { cart, refreshCart } = useCart()

  const item = cart?.items?.find((i) => i.id === initialItem.id) || initialItem

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    await updateLineItem({
      lineId: item.id,
      quantity
    }).catch(err => {
      setError(err.message)
    })
    await refreshCart()
    setUpdating(false)
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <TableRow className="w-full" data-testid="product-row">
      <TableCell className="w-12 relative">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={cn('flex', {
            'w-16': type === 'preview',
            'sm:w-24 w-12': type === 'full'
          })}>
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </TableCell>

      <TableCell className="text-left">
        <h4
          className="text-md font-bold"
          data-testid="product-title">
          {item.product_title}
        </h4>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </TableCell>

      {type === 'full' && (
        <TableCell>
          <Quantity
            value={item.quantity}
            onChange={value => changeQuantity(value)}
            data-testid="product-select-button" />
          <ErrorMessage error={error} data-testid="product-error-message" />
        </TableCell>
      )}

      <TableCell>
        <span
          className={cn('pr-0!', {
            'flex h-full flex-col items-end justify-center': type === 'preview'
          })}>
          {type === 'preview' && (
            <span className="flex gap-x-1">
              <span className="text-ui-fg-muted">{item.quantity}x </span>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </TableCell>
      <TableCell className="pr-0!">
        {
          updating
            ? <Spinner className='w-6 h-6' />
            : <DeleteButton id={item.id} data-testid="product-delete-button" />
        }
      </TableCell>
    </TableRow>
  )
}

export default Item
