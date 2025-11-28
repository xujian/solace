import { Metadata } from 'next'

import Hero from '@modules/home/components/hero'
import { listProducts } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { getCollections, getHero, getMarketing } from '@lib/data/cms'
import Banner from '@modules/home/components/banner'
import Collections from '@modules/home/components/collections'
import BestSellers from '@modules/home/components/best-sellers'

export const metadata: Metadata = {
  title: 'Ars Breeze',
  description:
    'A performant frontend ecommerce starter template with Next.js and Medusa.',
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const products = await listProducts({
    countryCode,
    queryParams: {
      fields: 'id, handle, title, thumbnail'
    }
  }).then(({ response }) => response.products)

  console.log('------products', products)

  if (!products || !region) {
    return null
  }

  const [
    { data: { hero } },
    { data: { marketing } },
    { data: collections }
  ] = await Promise.all([
    getHero(),
    getMarketing(),
    getCollections()
  ])

  return (
    <>
      <Hero data={hero} />
      <Collections data={collections} />
      <BestSellers data={products} />
      {marketing && <Banner data={marketing} />}
    </>
  )
}
