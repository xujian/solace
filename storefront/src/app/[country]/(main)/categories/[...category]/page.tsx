import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import { getCategoryByHandle, listCategories } from '@lib/data/categories'
import { listCountries } from '@lib/data/regions'
import { SortOptions } from '@modules/store/sort-products'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@lib/components/ui/breadcrumb'
import ProductFilters from '@modules/products/product-filters'
import ProductGrid from '@modules/products/product-grid'
import SkeletonProductGrid from '@modules/skeletons/skeleton-product-grid'

type Props = {
  params: Promise<{ category: string[]; country: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countries = await listCountries()

  const categoryHandles = product_categories.map((category: any) => category.handle)

  const staticParams = countries
    ?.map((country: string) =>
      categoryHandles.map((handle: any) => ({
        country,
        category: [handle]
      })) 
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name + ' | Medusa Store'

    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: `${params.category.join('/')}`
      }
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const category = await getCategoryByHandle(params.category)

  if (!category) {
    notFound()
  }
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }
  getParents(category)

  return (
    <div className="category-page flex flex-col gap-4" data-testid="category-container">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Categories</BreadcrumbLink>
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
      <Suspense fallback={<SkeletonProductGrid number={10} />}>
        <ProductGrid data={category.products!} />
      </Suspense>
    </div>
  )
}
