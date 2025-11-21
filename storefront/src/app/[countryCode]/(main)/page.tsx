import { Metadata } from 'next'

import FeaturedProducts from '@modules/home/components/featured-products'
import Hero from '@modules/home/components/hero'
import { listCollections } from '@lib/data/collections'
import { getRegion } from '@lib/data/regions'
import { getHero } from '@lib/data/cms'

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
    {data}
  ] = await Promise.all([
    getHero()
  ])

  console.log('data.banner-------------------------------->', data)

  return (
    <>
      <Hero data={data.hero} />
      <div className='py-12'>
        <ul className='flex flex-col gap-x-6'>
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
