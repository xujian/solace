import { Metadata } from 'next'
import { getCollections, getHero, getMarketing } from '@lib/data/cms'
import { listProducts } from '@lib/data/products'
import Banner from '@modules/home/banner'
import BestSellers from '@modules/home/best-sellers'
import Collections from '@modules/home/collections'
import Hero from '@modules/home/hero'

export const metadata: Metadata = {
  title: 'Ars Breeze',
  description: 'A performant frontend ecommerce starter template with Next.js and Medusa.'
}

export default async function Home(props: { params: Promise<{}> }) {

  const products = await listProducts({
    queryParams: {
      fields: 'id, handle, title, thumbnail'
    }
  }).then(({ response }) => response.products)

  if (!products) {
    return null
  }

  const [
    {
      data: { hero }
    },
    {
      data: { marketing }
    },
    collections
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
