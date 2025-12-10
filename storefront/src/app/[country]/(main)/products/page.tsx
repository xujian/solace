import { listProducts, retrieveFilters, search } from '@lib/data/products'
import ProductFilters from '@modules/products/product-filters'
import ProductsGrid from '@modules/products/product-grid'
import { SortOptions } from '@modules/products/sort'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Explore all of our products.'
}

type ProductsPageParams = {
  searchParams: Promise<{
    collection?: string
    category?: string
    material?: string
    price?: string
    q?: string
    sort?: SortOptions
    page?: number
    limit?: number
  }>
  params: Promise<{
    country: string
  }>
}

export default async function ProductsPage({
  searchParams
}: ProductsPageParams) {

  const { sort, page, limit, collection, category, material, price, q } = await searchParams

  const { products } = await search({
    currency: 'USD',
    sort: sort || 'relevance',
    page,
    limit,
    category: category?.split(','),
    collection: collection?.split(','),
    material: material?.split(','),
    price: price?.split(','),
    q
  })

  const filters = await retrieveFilters()
  return (
    <>
      <h1>Products</h1>
      <p>{products.length} totally</p>
      <p>&nbsp;</p>
      <ProductFilters data={filters} />
      <ProductsGrid data={products} />
    </>
  )
}