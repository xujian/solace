import { HttpTypes } from '@medusajs/types'
import { listProducts } from '@lib/data/products'
import InteractiveLink from '@modules/common/components/interactive-link'
import ProductPreview from '@modules/products/components/product-preview'

export default async function ProductRail({
  collection,
  region
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts }
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: '*variants.calculated_price'
    }
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="product-rail small:py-24 py-12">
      <div className="mb-8 flex justify-between">
        <h2 className="txt-xlarge">{collection.title}</h2>
        <InteractiveLink href={`/collections/${collection.handle}`}>View all</InteractiveLink>
      </div>
      <ul className="grid grid-cols-1 gap-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {pricedProducts &&
          pricedProducts.map(product => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
