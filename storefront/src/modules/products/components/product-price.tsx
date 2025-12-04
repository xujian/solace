import { HttpTypes } from '@medusajs/types'
import { getProductPrice } from '@lib/util/get-product-price'
import { cn } from '@lib/util'

export default function ProductPrice({
  product,
  variant
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (selectedPrice === null) {
    return (
      <div className="h-9 w-full rounded animate-pulse bg-gray-100">
        ({variant?.id}
        {selectedPrice})
      </div>
    )
  }

  return (
    <div className="text-ui-fg-base flex flex-col">
      <span
        className={cn('text-xl-semi', {
          'text-ui-fg-interactive': selectedPrice.price_type === 'sale'
        })}>
        {!variant && 'From '}
        <span className="text-3xl" data-testid="product-price" data-value={selectedPrice.calculated_price_number}>
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === 'sale' && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}>
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">-{selectedPrice.percentage_diff}%</span>
        </>
      )}
    </div>
  )
}
