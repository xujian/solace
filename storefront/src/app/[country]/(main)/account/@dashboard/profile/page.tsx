import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveCustomer } from '@lib/data/customer'
import { listRegions } from '@lib/data/regions'
import ProfilePhone from '@modules/account/profile-phone'
import ProfileBillingAddress from '@modules/account/profile-billing-address'
import ProfileEmail from '@modules/account/profile-email'
import ProfileName from '@modules/account/profile-name'
import ProfilePassword from '@modules/account/profile-password'

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
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1>Profile</h1>
        <p className="caption">
          View and update your profile information, including your name, email, and phone number. You can also update
          your billing address, or change your password.
        </p>
      </div>
      <div className="flex w-full flex-col gap-y-8">
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
        <ProfilePassword customer={customer} />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}
