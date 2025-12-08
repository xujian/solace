import { cookies } from 'next/headers'
import Medusa from '@medusajs/js-sdk'
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@lib/data/cookies'

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = 'http://localhost:9000'

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: 'jwt',
    jwtTokenStorageMethod: 'custom',
    storage: {
      setItem: async (key: string, value: string) => {
        try {
          const cookieStore = await cookies()
          cookieStore.set(AUTH_COOKIE_NAME, value, AUTH_COOKIE_OPTIONS)
        } catch {
          // Ignore if called outside request scope
        }
      },
      getItem: async (key: string) => {
        try {
          const cookieStore = await cookies()
          return cookieStore.get(AUTH_COOKIE_NAME)?.value || null
        } catch {
          return null
        }
      },
      removeItem: async (key: string) => {
        try {
          const cookieStore = await cookies()
          cookieStore.set(AUTH_COOKIE_NAME, '', {
            maxAge: -1
          })
        } catch {
          // Ignore if called outside request scope
        }
      }
    }
  }
})
