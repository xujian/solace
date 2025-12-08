import 'server-only'

import { cookies as nextCookies } from 'next/headers'

export const AUTH_COOKIE_NAME = '_medusa_jwt'
export const AUTH_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
} as const

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set(AUTH_COOKIE_NAME, '', {
    maxAge: -1
  })
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get('_medusa_cart_id')?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set('_medusa_cart_id', cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set('_medusa_cart_id', '', {
    maxAge: -1
  })
}
