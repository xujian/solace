import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { Card, CardContent, CardFooter } from '@lib/components/ui'
import { retrieveCustomer } from '@lib/data/customer'
import { listOrders } from '@lib/data/orders'
import { convertToLocale } from '@lib/util/money'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Overview of your account activity.'
}

export default async function Dashboard() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
    let count = 0
    if (!customer) {
      return 0
    }
    if (customer.email) {
      count++
    }
    if (customer.first_name && customer.last_name) {
      count++
    }
    if (customer.phone) {
      count++
    }
    const billingAddress = customer.addresses?.find(
      addr => addr.is_default_billing
    )
    if (billingAddress) {
      count++
    }
    return (count / 4) * 100
  }

  const stats = [
    {
      label: 'Profile',
      value: getProfileCompletion(customer),
      unit: '%',
      text: 'Edit profile',
      href: '/account/profile'
    },
    {
      label: 'Addresses',
      value: customer?.addresses?.length || 0,
      unit: '',
      text: 'Manage addresses',
      href: '/account/addresses'
    },
    {
      label: 'Orders',
      value: orders?.length || 0,
      unit: '',
      text: 'View orders',
      href: '/account/orders'
    }
  ]

  return (
    <div data-testid="overview-page-wrapper">
      <div className="mb-4 flex items-center justify-between">
        <span data-testid="welcome-message" data-value={customer?.first_name}>
          Hello {customer?.first_name}
        </span>
        <span className="text-foreground text-sm">
          Signed in as:{' '}
          <span
            className="font-semibold"
            data-testid="customer-email"
            data-value={customer?.email}>
            {customer?.email}
          </span>
        </span>
      </div>
      <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-6">
              <dd className="flex items-start justify-between space-x-2">
                <span className="truncate text-sm text-muted-foreground">
                  {stat.label}
                </span>
            </dd>
            <dd className="mt-1 text-3xl font-semibold text-foreground">
              {stat.value}
              <span className="text-sm text-muted-foreground ml-2">
                {stat.unit}
              </span>
            </dd>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted py-2">
            <LocalizedClientLink
              href={stat.href}
              className="text-sm font-medium text-muted-foreground">
              {stat.text} &#8594;
            </LocalizedClientLink>
          </CardFooter>
        </Card>
        ))}
      </dl>
    </div>
  )
}
