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

  const [message, action, pending] = useActionState(setAddresses, null)

  return (
    <section className="checkout-address-section">
      <h2>Address</h2>
      <form action={action}>
        <ShippingAddress
          customer={customer}
          checked={sameAsBilling}
          onChange={toggleSameAsBilling}
          cart={cart}
        />
        {!sameAsBilling && (
          <>
            <h2>Billing address</h2>
            <BillingAddress cart={cart} />
          </>
        )}
        <Button
          className="w-full"
          data-testid="submit-address-button"
          type="submit"
          isLoading={pending}>
          <ArrowDown />
          Continue to delivery
        </Button>
        <ErrorMessage error={message} data-testid="address-error-message" />
      </form>
    </section>
  )
}

export default Addresses
