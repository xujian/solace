import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.store.category
    .list(
      {
        fields:
          "*category_children, *products, *parent_category, *parent_category.parent_category",
        limit,
        ...query,
      },
      {
        next,
        cache: "force-cache",
      } as any
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.store.category
    .list(
      {
        fields: "*category_children, *products",
        handle,
      },
      {
        next,
        cache: "force-cache",
      } as any
    )
    .then(({ product_categories }) => product_categories[0])
}
