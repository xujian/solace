'use client'

import { HttpTypes } from '@medusajs/types'
import React, { createContext, useContext } from 'react'

interface SessionContextProps {
  region: HttpTypes.StoreRegion | null
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
  region: HttpTypes.StoreRegion
  children: React.ReactNode
}

export const SessionProvider = ({ region, children }: SessionProviderProps) => {
  return <SessionContext.Provider value={{ region }}>{children}</SessionContext.Provider>
}
