'use server'

import { HttpTypes } from '@medusajs/types'
import { sortProducts } from '@lib/util/sort-products'
import { sdk } from '@lib/config'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import { getAuthHeaders, getCacheOptions } from './cookies'
import { getRegion } from './regions'

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  region,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  region: string | HttpTypes.StoreRegion
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!region) {
    throw new Error('Country code or region ID is required')
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let r: HttpTypes.StoreRegion | null | undefined = region as HttpTypes.StoreRegion
  if (typeof region === 'string') {
    r = await getRegion(region)
  }

  if (!r) {
    return {
      response: { products: [], count: 0 },
      nextPage: null
    }
  }

  const headers = {
    ...(await getAuthHeaders())
  }

  const next = {
    ...(await getCacheOptions('products'))
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(`/store/products`, {
      method: 'GET',
      query: {
        limit,
        offset,
        region_id: r.id,
        fields: '*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,',
        ...queryParams
      },
      headers,
      next,
      cache: 'force-cache'
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
  sortBy = 'created_at',
  region
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  region: string | HttpTypes.StoreRegion
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
    },
    region
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
