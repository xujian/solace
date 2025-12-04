import { HttpTypes } from '@medusajs/types'
import ProductCard from '@modules/products/components/product-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@lib/components/ui/carousel'

export interface BestSellersProps {
  data: HttpTypes.StoreProduct[]
}

export default function BestSellers({ data }: BestSellersProps) {
  return (
    <section className="best-sellers">
      <div className="flex items-center justify-between">
        <h2>Best Sellers</h2>
      </div>
      <Carousel opts={{ axis: 'x', align: 'start', dragThreshold: 0 }} className='w-full'>
        <CarouselContent>
          {data.map(product => (
            <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard data={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-top-10 left-auto right-10" />
        <CarouselNext className="-top-10 right-0" />
      </Carousel>
    </section>
  )
}