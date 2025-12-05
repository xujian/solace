import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@lib/components/ui/breadcrumb'
import InteractiveLink from '@modules/common/components/interactive-link'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from '@modules/store/templates/paginated-products'

export default function CategoryTemplate({
  category,
  sortBy,
  page
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'

  if (!category) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="category-view flex flex-col gap-4" data-testid="category-container">
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
            <BreadcrumbLink href={`/collections/${category.handle}`}>
              {category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>{category.name}</h1>
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="text-2xl-semi mb-8 flex flex-row gap-4">
          {parents &&
            parents.map(parent => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link">
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
        </div>
        {category.description && (
          <div className="text-base-regular mb-8">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="text-base-large mb-8">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map(c => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
          />
        </Suspense>
      </div>
    </div>
  )
}
