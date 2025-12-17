import { retrieveCustomer } from '@lib/data/customer'
import AccountNav from '@modules/account/account-nav'
import LoginButton from '@modules/account/login-button'

export default async function AccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    return <LoginButton />
  }

  return (
    <div className="flex flex-col gap-y-4" data-testid="account-page">
      <div><AccountNav customer={customer} /></div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
