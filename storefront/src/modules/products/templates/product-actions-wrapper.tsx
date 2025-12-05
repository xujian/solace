import { retrieveProduct } from '@lib/data/products'
import ProductActions from '@modules/products/components/product-actions'
import { getVariantColors } from '@lib/data/cms'

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({ id }: { id: string }) {
  const product = await retrieveProduct(id),
    variantColors = await getVariantColors()
  if (!product) {
    return null
  }

  return <ProductActions product={product} colors={variantColors} />
}
