'use server'

import { HttpTypes } from '@medusajs/types'
import { sdk } from '@lib/config'
import { getCacheOptions } from './cookies'

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions('collections'))
  }

  return sdk.store.collection
    .retrieve(
      id,
      {},
      {
        next,
        cache: 'force-cache'
      } as any
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions('collections'))
  }

  queryParams.limit = queryParams.limit || '100'
  queryParams.offset = queryParams.offset || '0'

  return sdk.store.collection
    .list(
      queryParams,
      {
        next,
        cache: 'force-cache'
      } as any
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const next = {
    ...(await getCacheOptions('collections'))
  }

  return sdk.store.collection
    .list(
      { handle, fields: '*products' },
      {
        next,
        cache: 'force-cache'
      } as any
    )
    .then(({ collections }) => collections[0])
}
