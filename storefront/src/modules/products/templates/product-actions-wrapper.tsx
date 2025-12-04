import { retrieveProduct } from '@lib/data/products'
import ProductActions from '@modules/products/components/product-actions'

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({ id }: { id: string }) {
  const product = await retrieveProduct(id)

  if (!product) {
    return null
  }

  return <ProductActions product={product} />
}
