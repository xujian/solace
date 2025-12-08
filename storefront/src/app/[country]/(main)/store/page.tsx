import { Metadata } from 'next'
import { Suspense } from 'react'
import { SortOptions } from '@modules/store/sort-products'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/refinement-list'
import PaginatedProducts from '@modules/store/paginated-products'

export const metadata: Metadata = {
  title: 'Store',
  description: 'Explore all of our products.'
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    country: string
  }>
}

export default async function StorePage(props: Params) {
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'

  return (
    <div
      className="small:flex-row small:items-start content-container flex flex-col py-6"
      data-testid="category-container">
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="text-2xl-semi mb-8">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts sortBy={sort} page={pageNumber} />
        </Suspense>
      </div>
    </div>
  )
}
