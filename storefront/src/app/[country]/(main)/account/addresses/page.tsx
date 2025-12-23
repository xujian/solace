import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveAddresses } from '@lib/data/customer'
import AddAddress from '@modules/account/add-address'
import AddressCard from '@modules/account/address-card'

export const metadata: Metadata = {
  title: 'Addresses',
  description: 'View your addresses'
}

export default async function AddressesPage () {
  const addresses = await retrieveAddresses()

  if (!addresses) {
    notFound()
  }


  return (
    <>
      <h1>Shipping Addresses</h1>
      <p className="caption">
        View and update your shipping addresses, you can add as many as you like. Saving your addresses will make them
        available during checkout.
      </p>
      <p>&nbsp;</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {addresses.map(address => {
          return <AddressCard data={address} key={address.id} />
        })}
      </div>
      {
        addresses.length === 0 && (
          <div className="empty py-50 flex items-center justify-center">
            <p>You have no addresses saved.</p>
          </div>
        )
      }
      <div className="flex items-center justify-center py-10 gap-y-4">
        <AddAddress addresses={addresses} />
      </div>
    </>
  )
}
