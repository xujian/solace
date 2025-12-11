'use client'

import { StoreRegion } from '@medusajs/types'
import React, { createContext, useContext } from 'react'
import { HttpTypes } from '@medusajs/types'

interface SessionContextProps {
  country: string,
  region: StoreRegion,
  user: HttpTypes.StoreCustomer | null
}

const SessionContext = createContext<SessionContextProps | null>(null)

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

interface SessionProviderProps {
  country: string
  region: StoreRegion
  user: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

export const SessionProvider = ({ country, region, user, children }: SessionProviderProps) => {
  return <SessionContext.Provider value={{ country, region, user }}>{children}</SessionContext.Provider>
}
