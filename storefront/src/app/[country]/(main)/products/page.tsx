import { listProducts, retrieveFilters } from '@lib/data/products'
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
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    country: string
  }>
}

export default async function ProductsPage({
  searchParams
}: ProductsPageParams) {

  const products = await listProducts({
    queryParams: {
      fields: 'id, handle, title, thumbnail'
    }
  }).then(({ response }) => response.products)

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