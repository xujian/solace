import { retrieveCustomer } from '@lib/data/customer'
import { listRegions } from '@lib/data/regions'
import ProfileItems from '@modules/account/profile-items'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and edit your Medusa Store profile.'
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <>
      <h1>Profile</h1>
      <p className="caption">
        View and update your profile information, including your name, email,
        and phone number. You can also update your billing address, or change
        your password.
      </p>
      <p>&nbsp;</p>
      <ProfileItems customer={customer} regions={regions} />
    </>
  )
}
