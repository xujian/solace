'use client'
import { usePathname } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@lib/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@lib/components/ui'
import { useSession } from '@lib/context/session-context'
import { signout } from '@lib/data/customer'
import { cn } from '@lib/util'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Globe, MapPin, Package, User } from 'lucide-react'

const AccountNav = ({
  customer
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { country, user } = useSession()

  const handleLogout = async () => {
    await signout(country)
  }

  const items = [
    {
      value: 'overview',
      href: '/account',
      icon: <Globe size={20} />,
      label: 'Overview'
    },
    {
      value: 'profile',
      href: '/account/profile',
      icon: <User size={20} />,
      label: 'Profile'
    },
    {
      value: 'addresses',
      href: '/account/addresses',
      icon: <MapPin size={20} />,
      label: 'Addresses'
    },
    {
      value: 'orders',
      href: '/account/orders',
      icon: <Package size={20} />,
      label: 'Orders'
    }
  ]

  return (
    <Tabs className="account-nav flex items-center justify-center w-full" defaultValue="overview">
      <TabsList>
        {items.map((item) => (
          <TabsTrigger value={item.value} key={item.value}>
            <LocalizedClientLink
              href={item.href}
              className="flex items-center justify-between"
              data-testid="profile-link">
            <div className="flex items-center gap-x-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </LocalizedClientLink>
        </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  'data-testid'?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  'data-testid': dataTestId
}: AccountNavLinkProps) => {
  const { country } = useSession()

  const active = route.split(country)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={cn('text-muted-foreground hover:text-foreground', {
        'text-foreground font-semibold': active
      })}
      data-testid={dataTestId}>
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
