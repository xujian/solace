'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useCallback } from 'react'
import { useInteractive } from '@arsbreeze/interactive'
import { Badge, Button } from '@lib/components/ui'
import { useCart } from '@lib/context/cart-context'
import Cart from '@modules/cart/cart'
import { ShoppingCartIcon } from 'lucide-react'

const CartIcon = () => {
  const $ = useInteractive()
  const cart = useCart()

  const total =
    cart?.data?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const totalRef = useRef<number>(total || 0)
  const pathname = usePathname()

  const openDrawer = () => {
    $.drawer(Cart, {}, { title: 'Cart' })
  }

  // Open cart drawer when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (totalRef.current !== total) {
      if (!pathname.includes('/cart')) {
        openDrawer()
      }
      totalRef.current = total
    }
  }, [total, pathname, openDrawer])

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="nav-button"
        onClick={openDrawer}>
        <ShoppingCartIcon />
      </Button>
      <Badge className="absolute top-0 right-0 h-4 w-4 items-center justify-center bg-primary text-xs">
        {total}
      </Badge>
    </div>
  )
}

export default CartIcon
