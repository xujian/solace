import { HttpTypes } from '@medusajs/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@lib/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@lib/util'
import { Size } from 'types/global'

export type ProductCardProps = {
  data: HttpTypes.StoreProduct,
  size?: Size
}

const getSize = (name?: Size) => {
  if (!name) return 'w-full h-full'
  return ({
    xs: 'w-40 h-40',
    sm: 'w-50 h-50',
    md: 'w-60 h-60',
    lg: 'w-80 h-80',
    xl: 'w-100 h-100'
  })[name] || ''
}

export default function ProductCard({ data, size }: ProductCardProps) {
  return (
    <Card className="product-card bg-transparent border-0">
      <CardContent className="px-0">
        <Link href={`/products/${data.handle}`}>
          <Image src={data.thumbnail!} alt={data.title} width={200} height={200}
            className={cn('aspect-square object-cover rounded-md', getSize(size))} />
          <CardTitle className="mt">{data.title}</CardTitle>
        </Link>
      </CardContent>
    </Card>
  )
}
