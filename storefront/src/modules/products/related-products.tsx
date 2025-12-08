import { HttpTypes } from '@medusajs/types'
import { listProducts } from '@lib/data/products'
import ProductCard from '@modules/products/product-card'

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
}

export default async function RelatedProducts({ product }: RelatedProductsProps) {
  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}

  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags.map(t => t.id).filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams
  }).then(({ response }) => {
    return response.products.filter(responseProduct => responseProduct.id !== product.id)
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="mb-16 flex flex-col items-center text-center">
        <span className="text-base-regular mb-6 text-gray-600">Related products</span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">You might also want to check out these products.</p>
      </div>

      <ul className="sm:grid-cols-3 md:grid-cols-4 grid grid-cols-2 gap-x-6 gap-y-8">
        {products.map(product => (
          <li key={product.id}>
            <ProductCard data={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
