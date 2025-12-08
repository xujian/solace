'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@lib/components/ui'
import { convertToLocale } from '@lib/util/money'
import DeleteButton from '@modules/common/components/delete-button'
import LineItemOptions from '@modules/common/components/line-item-options'
import LineItemPrice from '@modules/common/components/line-item-price'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Thumbnail from '@modules/products/thumbnail'
import { ShoppingCartIcon } from 'lucide-react'

const CartDropdown = ({ cart: cartState }: { cart?: HttpTypes.StoreCart | null }) => {
  const [activeTimer, setActiveTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes('/cart')) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div className="cart-dropdown flex h-full items-center" onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover open={cartDropdownOpen} onOpenChange={setCartDropdownOpen}>
        <PopoverTrigger asChild className="relative">
          <LocalizedClientLink className="hover:text-ui-fg-base" href="/cart" data-testid="nav-cart-link">
            <Button variant="ghost" size="icon">
              <ShoppingCartIcon />
            </Button>
            <Badge className="absolute top-0 right-0 h-4 w-4 text-xs items-center justify-center bg-green-600" variant={'secondary'}>
              {totalItems}
            </Badge>
          </LocalizedClientLink>
        </PopoverTrigger>
        <PopoverContent
          className="small:block text-ui-fg-base absolute top-[calc(100%+1px)] right-0 hidden w-[420px] border-x border-b p-0"
          data-testid="nav-cart-dropdown"
          align="end"
          sideOffset={1}
          onInteractOutside={e => e.preventDefault()}>
          <div className="flex items-center justify-center p-4">
            <h3 className="text-large-semi">Cart</h3>
          </div>
          {cartState && cartState.items?.length ? (
            <>
              <div className="no-scrollbar grid max-h-[402px] grid-cols-1 gap-y-8 overflow-y-scroll p-px px-4">
                {cartState.items
                  .sort((a, b) => {
                    return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
                  })
                  .map(item => (
                    <div className="grid grid-cols-[122px_1fr] gap-x-4" key={item.id} data-testid="cart-item">
                      <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-24">
                        <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                      </LocalizedClientLink>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between">
                            <div className="mr-4 flex w-[180px] flex-col overflow-ellipsis whitespace-nowrap">
                              <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link">
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                              <span data-testid="cart-item-quantity" data-value={item.quantity}>
                                Quantity: {item.quantity}
                              </span>
                            </div>
                            <div className="flex justify-end">
                              <LineItemPrice item={item} style="tight" currencyCode={cartState.currency_code} />
                            </div>
                          </div>
                        </div>
                        <DeleteButton id={item.id} className="mt-1" data-testid="cart-item-remove-button">
                          Remove
                        </DeleteButton>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="text-small-regular flex flex-col gap-y-4 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-ui-fg-base font-semibold">
                    Subtotal <span className="font-normal">(excl. taxes)</span>
                  </span>
                  <span className="text-large-semi" data-testid="cart-subtotal" data-value={subtotal}>
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cartState.currency_code
                    })}
                  </span>
                </div>
                <LocalizedClientLink href="/cart" passHref>
                  <Button className="w-full" size="lg" data-testid="go-to-cart-button">
                    Go to cart
                  </Button>
                </LocalizedClientLink>
              </div>
            </>
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center gap-y-4 py-16">
                <div className="text-small-regular flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white">
                  <span>0</span>
                </div>
                <span>Your shopping bag is empty.</span>
                <div>
                  <LocalizedClientLink href="/store">
                    <>
                      <span className="sr-only">Go to all products page</span>
                      <Button onClick={close}>Explore products</Button>
                    </>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CartDropdown
