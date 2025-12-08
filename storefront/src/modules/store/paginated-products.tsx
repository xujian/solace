import { listProductsWithSort } from '@lib/data/products'
import ProductCard from '@modules/products/product-card'
import { Pagination } from '@modules/store/pagination'
import { SortOptions } from '@modules/store/sort-products'

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12
  }

  if (collectionId) {
    queryParams['collection_id'] = [collectionId]
  }

  if (categoryId) {
    queryParams['category_id'] = [categoryId]
  }

  if (productsIds) {
    queryParams['id'] = productsIds
  }

  if (sortBy === 'created_at') {
    queryParams['order'] = 'created_at'
  }

  let {
    response: { products, count }
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list">
        {products.map(p => {
          return (
            <li key={p.id}>
              <ProductCard data={p} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />}
    </>
  )
}
