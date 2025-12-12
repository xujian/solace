'use client'

import { HttpTypes } from '@medusajs/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { retrieveCart } from '@lib/data/cart'

interface CartContextProps {
  cart: HttpTypes.StoreCart | null
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextProps | null>(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({
  cart: initialCart,
  children
}: {
  cart: HttpTypes.StoreCart | null
  children: React.ReactNode
}) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(initialCart)

  const refreshCart = async () => {
    const newCart = await retrieveCart()
    setCart(newCart)
  }

  // Sync initialCart if it changes from upstream (e.g. server re-render)
  useEffect(() => {
    setCart(initialCart)
  }, [initialCart])

  return (
    <CartContext.Provider value={{ cart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}
