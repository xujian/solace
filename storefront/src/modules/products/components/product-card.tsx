import { HttpTypes } from '@medusajs/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@lib/components/ui'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({ data }: { data: HttpTypes.StoreProduct }) {
  return (
    <Card className="product-card bg-transparent border-0 w-full h-full">
      <CardContent className="px-0">
        <Link href={`/products/${data.handle}`}>
          <Image src={data.thumbnail!} alt={data.title} width={200} height={200}
            className="aspect-square object-cover rounded-md w-full h-full" />
          <CardTitle className="mt">{data.title}</CardTitle>
        </Link>
      </CardContent>
    </Card>
  )
}
