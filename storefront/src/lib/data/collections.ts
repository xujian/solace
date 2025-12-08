'use server'

import { HttpTypes } from '@medusajs/types'
import { sdk } from '@lib/config'


export const retrieveCollection = async (id: string) => {
  return sdk.store.collection
    .retrieve(
      id,
      {},
      {
        next: { tags: ['collections'] }
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || '100'
  queryParams.offset = queryParams.offset || '0'

  return sdk.store.collection
    .list(
      queryParams,
      {
        next: { tags: ['collections'] }
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  return sdk.store.collection
    .list(
      { handle, fields: '*products' },
      {
        next: { tags: ['collections'] }
      }
    )
    .then(({ collections }) => collections[0])
}
