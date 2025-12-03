import { listProducts } from '@lib/data/products'
import { getCurrentRegion } from '@lib/data/server-context'
import ProductActions from '@modules/products/components/product-actions'

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({ id }: { id: string }) {
  const product = await listProducts({
    queryParams: { id: [id] }
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  return <ProductActions product={product} />
}
