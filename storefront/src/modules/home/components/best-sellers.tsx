import { HttpTypes } from '@medusajs/types'
import ProductCard from '@modules/common/components/product-card'


export interface BestSellersProps {
  data: HttpTypes.StoreProduct[]
}

export default function BestSellers({ data }: BestSellersProps) {
  return (
    <section className="best-sellers">
      <h2>Best Sellers</h2>
      <div className='grid grid-cols-1 gap xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4'>
        {data.map(product => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  )
}