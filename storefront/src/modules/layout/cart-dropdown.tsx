'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from '@lib/components/ui'
import { convertToLocale } from '@lib/util/money'
import LineItemOptions from '@modules/common/components/line-item-options'
import LineItemPrice from '@modules/common/components/line-item-price'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Thumbnail from '@modules/products/thumbnail'
import { ShoppingCartIcon, X } from 'lucide-react'

const CartDropdown = ({ data }: { data?: HttpTypes.StoreCart | null }) => {
  const [activeTimer, setActiveTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [visible, setVisible] = useState(false)

  const open = () => setVisible(true)
  const close = () => setVisible(false)

  const total =
    data?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = data?.subtotal ?? 0
  const totalRef = useRef<number>(total || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
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
  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (totalRef.current !== total) {
      if (!pathname.includes('/cart')) {
        timedOpen()
      }
      totalRef.current = total
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, pathname])

  const onOpenChange = (value: boolean) => {
    console.log('open', value)
    if (!value) {
      close()
    } else {
      open()
    }
  }

  return (
    <Popover open={visible} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCartIcon />
          </Button>
          <Badge className="absolute top-0 right-0 h-4 w-4 text-xs items-center justify-center bg-primary">
            {total}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="sm:block absolute right-0 hidden w-[480px]"
        data-testid="nav-cart-dropdown"
        align="end">
        <h2>Cart</h2>
        {data && data.items?.length ? (
          <>
            <div className="items w-full flex flex-col gap-4 mb-4">
              {data.items
                .sort((a, b) => {
                  return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
                })
                .map(item => (
                  <div className="item-row flex w-full items-center gap-2" key={item.id} data-testid="cart-item">
                    <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-20">
                      <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                    </LocalizedClientLink>
                    <div className="item-info flex flex-1 flex-col justify-between">
                      <h3 className="text-md font-semibold">
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
                      <LineItemPrice item={item} style="tight" currencyCode={data.currency_code} />
                    </div>
                    <div className="flex-0">
                      <Badge>{item.quantity}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      onClick={() => {
                      }}>
                      <X />
                    </Button>
                  </div>
                ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between leading-12">
                <span className="font-semibold">
                  Subtotal <span className="font-normal">(excl. taxes)</span>
                </span>
                <span className="" data-testid="cart-subtotal" data-value={subtotal}>
                  {convertToLocale({
                    amount: subtotal,
                    currency_code: data.currency_code
                  })}
                </span>
              </div>
              <LocalizedClientLink href="/cart" passHref>
                <Button className="w-full" data-testid="go-to-cart-button">
                  Go to cart
                </Button>
              </LocalizedClientLink>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className='leading-20'>Your shopping bag is empty.</p>
            <LocalizedClientLink className='w-full' href="/store">
              <Button className="w-full" onClick={close}>Explore products</Button>
            </LocalizedClientLink>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default CartDropdown
