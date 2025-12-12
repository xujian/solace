'use client'

import { HttpTypes } from '@medusajs/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { retrieveCart, addToCart, deleteItem, updateLineItem } from '@lib/data/cart'
import { useSession } from './session-context'

interface CartContextData {
  data: HttpTypes.StoreCart | null
  refresh: () => Promise<void>
  add: (item: { variant: string, quantity: number }) => Promise<void>
  remove: (lineId: string) => Promise<void>
  update: (lineId: string, quantity: number) => Promise<void>
}

const CartContext = createContext<CartContextData | null>(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({
  data: initialData,
  children
}: {
  data: HttpTypes.StoreCart | null
  children: React.ReactNode
}) => {
  const [data, setData] = useState<HttpTypes.StoreCart | null>(initialData)
  const { region } = useSession()

  const refresh = async () => {
    const newData = await retrieveCart()
    setData(newData)
  }

  // Actually, I cannot easily add imports with multi_replace if they are at the top and I am replacing the body.
  // I will first update the interface and the Provider body.
  // Then I will add imports.
  
  // Let's rewrite the body properly.
  
  const add = async ({ variant, quantity }: { variant: string; quantity: number }) => {
    await addToCart({ variantId: variant, quantity, region })
    await refresh()
  }

  const remove = async (line: string) => {
    await deleteItem(line)
    await refresh()
  }

  const update = async (line: string, quantity: number) => {
    await updateLineItem({ lineId: line, quantity })
    await refresh()
  }

  // Sync initialData if it changes from upstream (e.g. server re-render)
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  return (
    <CartContext.Provider value={{ data, refresh, add, remove, update }}>
      {children}
    </CartContext.Provider>
  )
}
