import { getRegion } from '@lib/data/regions'
import { SessionProvider } from '@modules/common/components/session-context'
import { notFound } from 'next/navigation'

export default async function RegionLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ region: string }>
}) {
  const { region: regionCode } = await params
  const region = await getRegion(regionCode)

  if (!region) {
    return notFound()
  }

  return <SessionProvider region={region}>{children}</SessionProvider>
}
