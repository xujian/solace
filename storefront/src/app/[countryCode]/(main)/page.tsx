import { Metadata } from 'next'

import FeaturedProducts from '@modules/home/components/featured-products'
import Hero from '@modules/home/components/hero'
import { listCollections } from '@lib/data/collections'
import { getRegion } from '@lib/data/regions'
import { getHero, getMarketing } from '@lib/data/cms'
import Banner from '@modules/home/components/banner'

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

  const { collections } = await listCollections({
    fields: 'id, handle, title',
  })

  if (!collections || !region) {
    return null
  }

  const [
    { data: { hero } },
    { data: { marketing } }
  ] = await Promise.all([
    getHero(),
    getMarketing()
  ])

  return (
    <>
      <Hero data={hero} />
      <FeaturedProducts collections={collections} region={region} />
      {marketing && <Banner data={marketing} />}
    </>
  )
}
