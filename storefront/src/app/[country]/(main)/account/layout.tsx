import { retrieveCustomer } from '@lib/data/customer'
import UnderlineLink from '@modules/common/components/interactive-link'
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
    <div className="sm:py-12 flex-1" data-testid="account-page">
      <div className="content-container mx-auto flex h-full max-w-5xl flex-1 flex-col">
        <div className="sm:grid-cols-[240px_1fr] grid grid-cols-1 py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="small:flex-row small:border-t flex flex-col items-end justify-between gap-8 border-gray-200 py-12">
          <div>
            <h3 className="text-xl-semi mb-4">Got questions?</h3>
            <span className="txt-medium">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}
