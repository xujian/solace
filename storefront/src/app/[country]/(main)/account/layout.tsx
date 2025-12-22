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
    return <div className="w-full h-full flex flex-col py-8 justify-center items-center">
      <LoginButton />
    </div>
  }

  return (
    <div className="" data-testid="account-page">
      <div className="w-full flex flex-col py-8 justify-center items-center">
        <AccountNav customer={customer} />
      </div>
      {children}
    </div>
  )
}
