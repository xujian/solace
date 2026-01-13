'use client'

import { useState } from 'react'
import { Badge, Button, Spinner } from '@lib/components/ui'
import { convertToLocale } from '@lib/util/money'
import LineItemOptions from '@modules/cart/line-item-options'
import LineItemPrice from '@modules/common/components/line-item-price'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Thumbnail from '@modules/products/thumbnail'
import { X } from 'lucide-react'
import { useCart } from '@lib/context/cart-context'
import type { InteractiveContentProps } from '@arsbreeze/interactive'

const Cart: React.FC<InteractiveContentProps> = ({ onComplete }) => {
  const cart = useCart()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const subtotal = cart?.data?.subtotal ?? 0
  
  const handleDeleteItem = async (id: string) => {
    setIsDeleting(id)
    await cart.remove(id).catch(() => {
      setIsDeleting(null)
    })
    setIsDeleting(null)
  }

  const handleClose = () => {
    onComplete?.()
  }

  return (
    <section className="flex h-full flex-col">
      {cart.data && cart.data.items?.length ? (
        <>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {cart.data.items
              .sort((a, b) => {
                return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
              })
              .map(item => (
                <article
                  className="flex w-full items-center gap-2"
                  key={item.id}
                  data-testid="cart-item"
                >
                  <LocalizedClientLink
                    href={`/products/${item.product_handle}`}
                    className="w-20"
                    onClick={handleClose}
                  >
                    <Thumbnail
                      thumbnail={item.thumbnail}
                      images={item.variant?.product?.images}
                      size="square"
                    />
                  </LocalizedClientLink>
                  <div className="flex flex-1 flex-col justify-between">
                    <h3 className="text-md font-semibold">
                      <LocalizedClientLink
                        href={`/products/${item.product_handle}`}
                        data-testid="product-link"
                        onClick={handleClose}
                      >
                        {item.title}
                      </LocalizedClientLink>
                    </h3>
                    <LineItemOptions
                      variant={item.variant}
                      data-testid="cart-item-variant"
                      data-value={item.variant}
                    />
                    <LineItemPrice
                      item={item}
                      style="tight"
                      currencyCode={cart.data?.currency_code ?? ''}
                    />
                  </div>
                  <div className="flex-0">
                    <Badge>{item.quantity}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-6 w-6"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    {isDeleting === item.id ? (
                      <Spinner className="animate-spin" />
                    ) : (
                      <X />
                    )}
                  </Button>
                </article>
              ))}
          </div>
          <footer className="mt-auto flex flex-col pt-4">
            <div className="flex items-center justify-between leading-12">
              <span className="font-semibold">
                Subtotal <span className="font-normal">(excl. taxes)</span>
              </span>
              <span data-testid="cart-subtotal" data-value={subtotal}>
                {convertToLocale({
                  amount: subtotal,
                  currency_code: cart.data?.currency_code
                })}
              </span>
            </div>
            <LocalizedClientLink href="/cart" passHref onClick={handleClose}>
              <Button className="w-full" data-testid="go-to-cart-button">
                Go to cart
              </Button>
            </LocalizedClientLink>
          </footer>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="leading-20">Your shopping bag is empty.</p>
          <LocalizedClientLink
            className="w-full"
            href="/store"
            onClick={handleClose}
          >
            <Button className="w-full">Explore products</Button>
          </LocalizedClientLink>
        </div>
      )}
    </section>
  )
}

export default Cart
