'use server'

import { HttpTypes } from '@medusajs/types'
import medusaError from '@lib/util/medusa-error'
import { sdk } from '@lib/config'

export const retrieveOrder = async (id: string) => {

  return sdk.store.order
    .retrieve(
      id,
      {
        fields:
          '*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product'
      },
      {
        next: { tags: ['orders'] }
      }
    )
    .then(({ order }) => order)
    .catch(err => medusaError(err))
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {

  return sdk.store.order
    .list(
      {
        limit,
        offset,
        order: '-created_at',
        fields: '*items,+items.metadata,*items.variant,*items.product',
        ...filters
      },
      {
        next: { tags: ['orders'] }
      }
    )
    .then(({ orders }) => orders)
    .catch(err => medusaError(err))
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get('order_id') as string

  if (!id) {
    return { success: false, error: 'Order ID is required', order: null }
  }



  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: 'id, email'
      }
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch(err => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {


  return await sdk.store.order
    .acceptTransfer(id, { token })
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch(err => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {


  return await sdk.store.order
    .declineTransfer(id, { token })
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch(err => ({ success: false, error: err.message, order: null }))
}
