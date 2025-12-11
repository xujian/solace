import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ChevronDown } from 'lucide-react'

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {


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

  return (
    <div data-testid="overview-page-wrapper">
      <div className="mb-4 flex items-center justify-between">
        <span data-testid="welcome-message" data-value={customer?.first_name}>
          Hello {customer?.first_name}
        </span>
        <span className="text-ui-fg-base text-sm">
          Signed in as:{' '}
          <span
            className="font-semibold"
            data-testid="customer-email"
            data-value={customer?.email}>
            {customer?.email}
          </span>
        </span>
      </div>
      <div className="flex h-full flex-1 flex-col gap-y-4">
        <div className="mb-6 flex items-start gap-x-16">
          <div className="flex flex-col gap-y-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <div className="flex items-end gap-x-2">
              <span
                className="text-3xl leading-none font-semibold"
                data-testid="customer-profile-completion"
                data-value={getProfileCompletion(customer)}>
                {getProfileCompletion(customer)}%
              </span>
              <span className="text-ui-fg-subtle text-base uppercase">
                Completed
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <h3 className="text-lg font-semibold">Addresses</h3>
            <div className="flex items-end gap-x-2">
              <span
                className="text-3xl leading-none font-semibold"
                data-testid="addresses-count"
                data-value={customer?.addresses?.length || 0}>
                {customer?.addresses?.length || 0}
              </span>
              <span className="text-ui-fg-subtle text-base uppercase">
                Saved
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <h3 className="text-lg font-semibold">Recent orders</h3>
          </div>
          <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map(order => {
                return (
                  <li
                    key={order.id}
                    data-testid="order-wrapper"
                    data-value={order.id}>
                    <LocalizedClientLink
                      href={`/account/orders/details/${order.id}`}>
                      <div className="border-ui-border-base rounded-rounded flex items-center justify-between border bg-gray-50 p-4">
                        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-x-4 text-sm">
                          <span className="font-semibold">Date placed</span>
                          <span className="font-semibold">Order number</span>
                          <span className="font-semibold">Total amount</span>
                          <span data-testid="order-created-date">
                            {new Date(order.created_at).toDateString()}
                          </span>
                          <span
                            data-testid="order-id"
                            data-value={order.display_id}>
                            #{order.display_id}
                          </span>
                          <span data-testid="order-amount">
                            {convertToLocale({
                              amount: order.total,
                              currency_code: order.currency_code
                            })}
                          </span>
                        </div>
                        <button
                          className="flex items-center justify-between"
                          data-testid="open-order-button">
                          <span className="sr-only">
                            Go to order #{order.display_id}
                          </span>
                          <ChevronDown className="-rotate-90" />
                        </button>
                      </div>
                    </LocalizedClientLink>
                  </li>
                )
              })
            ) : (
              <span data-testid="no-orders-message">No recent orders</span>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Overview
