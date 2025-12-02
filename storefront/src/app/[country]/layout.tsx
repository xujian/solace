import { notFound } from 'next/navigation'
import { getRegion } from '@lib/data/regions'
import { SessionProvider } from '@lib/context/session-context'

export default async function CountryLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  const region = await getRegion(country)

  if (!region) {
    notFound()
  }

  return (
    <SessionProvider country={country} region={region}>
      {children}
    </SessionProvider>
  )
}
