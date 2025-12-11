import { retrieveCustomer } from '@lib/data/customer'
import AccountNav from '@modules/account/account-nav'

export default async function AccountLayout({
  dashboard,
  auth
}: {
  dashboard?: React.ReactNode
  auth?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)
  const authed = !!customer
  const children = authed ? dashboard : auth

  return (
    <div className="flex flex-col gap-y-4" data-testid="account-page">
      <div>{authed && <AccountNav customer={customer} />}</div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
