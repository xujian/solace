import React from 'react'
import { HttpTypes } from '@medusajs/types'
import AddAddress from './add-address'
import EditAddress from './edit-address-modal'

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
}

const AddressBook: React.FC<AddressBookProps> = ({ customer }) => {
  const { addresses } = customer
  return (
    <div className="w-full">
      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <AddAddress addresses={addresses} />
        {addresses.map(address => {
          return <EditAddress address={address} key={address.id} />
        })}
      </div>
    </div>
  )
}

export default AddressBook
