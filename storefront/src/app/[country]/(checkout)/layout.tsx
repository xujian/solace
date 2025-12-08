import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ChevronDown } from 'lucide-react'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="small:min-h-screen relative w-full">
      <div className="h-16">
        <nav className="content-container flex h-full items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex flex-1 basis-0 items-center gap-x-2 uppercase"
            data-testid="back-to-cart-link">
            <ChevronDown className="rotate-90" size={16} />
            <span className="small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base mt-px hidden">
              Back to shopping cart
            </span>
            <span className="small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base mt-px block">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            data-testid="store-link">
            Medusa Store
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <div className="flex w-full items-center justify-center py-4"></div>
    </div>
  )
}
