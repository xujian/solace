import {
  HeroData
} from 'types/cms'



export const fetchContent = async (
  endpoint: string,
  params?: RequestInit
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_READ_TOKEN}`,
      },
      ...params,
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
      '&populate[3]=hero.image',
    ].join(''),
    {
      next: { tags: ['hero'] },
    }
  )

  console.log('res-------------------------------->', res)

  return res.json()
}
