import { getRegion } from '@lib/data/regions'
import { SessionProvider } from '@modules/common/components/session-context'
import { notFound } from 'next/navigation'

export default async function RegionLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  const region = await getRegion(country)

  if (!region) {
    return notFound()
  }

  return <SessionProvider region={region}>{children}</SessionProvider>
}
