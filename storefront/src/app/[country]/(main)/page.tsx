import { Metadata } from 'next'
import { getCollections, getHero, getMarketing } from '@lib/data/cms'
import { listProducts } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import Banner from '@modules/home/components/banner'
import BestSellers from '@modules/home/components/best-sellers'
import Collections from '@modules/home/components/collections'
import Hero from '@modules/home/components/hero'

export const metadata: Metadata = {
  title: 'Ars Breeze',
  description: 'A performant frontend ecommerce starter template with Next.js and Medusa.'
}

export default async function Home(props: { params: Promise<{ country: string }> }) {
  const params = await props.params

  const region = await getRegion(params.country)

  const products = await listProducts({
    region: params.country,
    queryParams: {
      fields: 'id, handle, title, thumbnail'
    }
  }).then(({ response }) => response.products)

  if (!products || !region) {
    return null
  }

  const [
    {
      data: { hero }
    },
    {
      data: { marketing }
    },
    { data: collections }
  ] = await Promise.all([getHero(), getMarketing(), getCollections()])

  return (
    <>
      <Hero data={hero} />
      <Collections data={collections} />
      <BestSellers data={products} />
      {marketing && <Banner data={marketing} />}
    </>
  )
}
