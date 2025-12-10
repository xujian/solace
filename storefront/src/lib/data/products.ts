'use server'

import { HttpTypes } from '@medusajs/types'
import { sortProducts } from '@lib/util/sort-products'
import { sdk } from '@lib/sdk'
import { SortOptions } from '@modules/products/sort'
import { getAuthHeaders } from './cookies'
import { getRegion, retrieveRegion } from './regions'
import { getCurrentCountry, getCurrentRegion } from './server-context'
import { Filters } from 'types/global'

const fields = [
  '*variants.calculated_price', 
  '+variants.inventory_quantity', 
  '*variants.images', '+metadata', 
  '+tags',
  '*categories'
].join(',')

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  country
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  country?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  const region = await getRegion(country || await getCurrentCountry())

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null
    }
  }

  return sdk.store.product
    .list(
      {
        limit,
        offset,
        region_id: region?.id,
        fields,
        ...queryParams
      },
      {
        next: { tags: ['products'] }
      })
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count
        },
        nextPage: nextPage,
        queryParams
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = 'created_at'
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count }
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100
    }
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count
    },
    nextPage,
    queryParams
  }
}

export const retrieveProductByHandle = async (handle: string): Promise<HttpTypes.StoreProduct | null> => {
  const region = await getCurrentRegion()

  if (!region) {
    return null
  }
  return sdk.store.product.list({
    handle,
    fields,
    region_id: region.id
  }).then(({ products }) => products[0])
  .catch(() => null)
}

export const retrieveProduct = async (id: string): Promise<HttpTypes.StoreProduct | null> => {
  const region = await getCurrentRegion()

  if (!region) {
    return null
  }

  return sdk.store.product.retrieve(id, {
    fields,
    region_id: region.id
  }).then(({ product }) => product)
  .catch(() => null)  
}

export const retrieveFilters = async (): Promise<Filters> => {
  const headers = {
    ...(await getAuthHeaders()),
  }
  return sdk.client.fetch<StoreFilters>('/store/filters', {
    headers
  })
}

export type SearchParams = {
  currency: string
  page?: number
  limit?: number
  sort?: string
  category?: string[]
  collection?: string[]
  material?: string[]
  price?: string[]
  q?: string
}

export async function search({
  currency,
  page,
  limit,
  sort = 'relevance',
  category,
  collection,
  material,
  price,
  q,
}: SearchParams): Promise<{products: HttpTypes.StoreProduct[], count: number}> {
  const sorting =
    sort === 'price_asc'
      ? 'calculated_price'
      : sort === 'price_desc'
        ? '-calculated_price'
        : sort === 'created_at'
          ? '-created_at'
          : sort

  const searchParams = new URLSearchParams({
    currency,
    sort: sorting,
    offset: `${((page || 1) - 1) * 10}`,
    limit: '10',
  })

  if (category && Array.isArray(category)) {
    category.forEach((id) => {
      searchParams.append('category[]', id)
    })
  }
  if (collection && Array.isArray(collection)) {
    collection.forEach((id) => {
      searchParams.append('collection[]', id)
    })
  }
  if (material && Array.isArray(material)) {
    material.forEach((id) => {
      searchParams.append('material[]', id)
    })
  }
  if (price && Array.isArray(price)) {
    price.forEach((range) => {
      switch (range) {
        case 'under-100':
          searchParams.append('price[]', '100')
          break
        case '100-500':
          searchParams.append('price[]', '100')
          searchParams.append('price[]', '500')
          break
        case '501-1000':
          searchParams.append('price[]', '501')
          break
        case 'more-than-1000':
          searchParams.append('price[]', '1000')
          break
      }
    })
  }
  if (q) {
    searchParams.append('q', decodeURIComponent(q))
  }

  const search = searchParams.toString()

  // console.log('///////////////////search', search)
  const results = await sdk.client.fetch(
    `/store/search?${search}`,
    {
      cache: 'no-store',
    }
  )
  return results
}
