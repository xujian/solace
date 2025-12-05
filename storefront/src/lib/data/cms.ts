import { Collection, HeroData, MarketingData, VariantColor } from 'types/cms'

export const fetchContent = async (endpoint: string, params?: RequestInit) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_READ_TOKEN}`
      },
      ...params
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }

  return response
}

export const getHero = async (): Promise<HeroData> => {
  const res = await fetchContent(
    [
      '/api/home?',
      'populate[1]=hero',
      '&populate[2]=hero.cta',
      '&populate[3]=hero.image'
    ].join(''),
    {
      next: { tags: ['hero'] }
    }
  )

  return res.json()
}

export const getMarketing = async (): Promise<MarketingData> => {
  const res = await fetchContent(
    [
      '/api/home?',
      'populate[1]=marketing',
      '&populate[2]=marketing.cta',
      '&populate[3]=marketing.image'
    ].join(''),
    {
      next: { tags: ['marketing'] }
    }
  )
  return res.json()
}

export const getCollections = async (): Promise<Collection[]> => {
  const res = await fetchContent(['/api/collections?', 'populate=*'].join(''), {
    next: { tags: ['collections'] }
  })
  const { data } = await res.json()
  return data
}

// Variant Colors
export const getVariantColors = async (): Promise<VariantColor[]> => {
  const res = await fetchContent(
    `/api/variant-colors?populate[1]=type&populate[2]=type.image&pagination[start]=0&pagination[limit]=100`,
    {
      next: { tags: ['variant-colors'] }
    }
  )
  const { data } = await res.json()
  // transform Strapi response to VariantColor[]
  const result = data
    .filter((d: any) => d.type.length > 0)
    .map((d: any) => {
      const type = d.type[0]
      return {
        type: type.__component === 'variant.color-image'
          ? 'image'
          : 'hex',
        value: type.__component === 'variant.color-image'
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${type.image.url}`
          : type.value,
        name: d.name
      }
    })
  return result
}
