'use client'

import { StoreRegion } from '@medusajs/types'
import React, { createContext, useContext } from 'react'

interface SessionContextProps {
  country: string,
  region: StoreRegion
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
  children: React.ReactNode
}

export const SessionProvider = ({ country, region, children }: SessionProviderProps) => {
  return <SessionContext.Provider value={{ country, region }}>{children}</SessionContext.Provider>
}
