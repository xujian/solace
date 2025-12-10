import { retrieveCustomer } from '@lib/data/customer'
import AccountNav from '@modules/account/account-nav'

export default async function AccountPageLayout({
  dashboard,
  login
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)
  
  const children = customer ? dashboard : login

  return (
    <div className="flex flex-col gap-y-4" data-testid="account-page">
      <div>{customer && <AccountNav customer={customer} />}</div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
