import { HttpTypes } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="mx-auto flex flex-col gap-y-4 lg:max-w-[500px]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle">
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h2 className="text-ui-fg-base text-3xl leading-10" data-testid="product-title">
          {product.title}
        </h2>

        <p className="text-medium text-ui-fg-subtle whitespace-pre-line" data-testid="product-description">
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo
