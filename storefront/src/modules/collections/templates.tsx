import { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@lib/components/ui/breadcrumb'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from '@modules/store/templates/paginated-products'

export default function CollectionTemplate({
  sortBy,
  collection,
  page
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'

  return (
    <div className="collection-view flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/collections">Collections</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/collections/${collection.handle}`}>
              {collection.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>{collection.title}</h1>
      <RefinementList sortBy={sort} />
      <Suspense
        fallback={
          <SkeletonProductGrid
            numberOfProducts={collection.products?.length}
          />
        }>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          collectionId={collection.id}
        />
      </Suspense>
    </div>
  )
}
