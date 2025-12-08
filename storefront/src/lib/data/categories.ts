import { HttpTypes } from '@medusajs/types'
import { sdk } from '@lib/sdk'

export const listCategories = async (query?: Record<string, any>) => {
  const limit = query?.limit || 100


  return sdk.store.category
    .list(
      {
        fields:
          '*category_children, *products, *parent_category, *parent_category.parent_category',
        limit,
        ...query
      },
      {
        next: { tags: ['categories'] }
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join('/')}`


  return sdk.store.category
    .list(
      {
        fields: '*category_children, *products',
        handle
      },
      {
        next: { tags: ['categories'] }
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
