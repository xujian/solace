'use client'

import { Button } from '@lib/components/ui'
import { setAddresses } from '@lib/data/cart'
import compareAddresses from '@lib/util/compare-addresses'
import { HttpTypes } from '@medusajs/types'
import { ArrowDown } from 'lucide-react'
import { useActionState, useState } from 'react'
import BillingAddress from './billing_address'
import ErrorMessage from './error-message'
import ShippingAddress from './shipping-address'

const Addresses = ({
  cart,
  customer
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const [sameAsBilling, setSameAsBilling] = useState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )
  const toggleSameAsBilling = () => setSameAsBilling(!sameAsBilling)

  const [message, formAction, isPending] = useActionState(setAddresses, null)

  return (
    <div>
      <div className="mb-6 flex flex-row items-center justify-between">
        <h2 className="flex flex-row gap-2">Address</h2>
      </div>
      <form action={formAction}>
        <div className="pb-8">
          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />
          {!sameAsBilling && (
            <div>
              <h2 className="text-3xl-regular gap-x-4 pt-8 pb-6">
                Billing address
              </h2>

              <BillingAddress cart={cart} />
            </div>
          )}
          <Button
            className="w-full"
            data-testid="submit-address-button"
            type="submit"
            isLoading={isPending}>
            <ArrowDown />
            Continue to delivery
          </Button>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </div>
      </form>
    </div>
  )
}

export default Addresses
