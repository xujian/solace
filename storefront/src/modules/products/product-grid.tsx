import { HttpTypes } from '@medusajs/types'
import ProductCard from './product-card'

export default function ProductsGrid({
  data
}: {
  data: HttpTypes.StoreProduct[]
}) {
  return (
    <section className="products-grid">
      <div className="grid-auto">
        {data.map(product => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  )
}
