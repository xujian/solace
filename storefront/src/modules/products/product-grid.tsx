import { HttpTypes } from '@medusajs/types'
import ProductCard from './product-card'

export default function ProductsGrid({
  data
}: {
  data: HttpTypes.StoreProduct[]
}) {
  return (
    <section className="products-grid">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map(product => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  )
}
