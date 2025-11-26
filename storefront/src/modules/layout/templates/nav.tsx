import Image from 'next/image'
import { Suspense } from 'react'
import { StoreRegion } from '@medusajs/types'
import { listRegions } from '@lib/data/regions'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import CartButton from '@modules/layout/components/cart-button'
import SideMenu from '@modules/layout/components/side-menu'
import { ShoppingCartIcon, UserIcon } from 'lucide-react'

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-around gap-2 px-4 duration-200">
      <div className="flex h-full flex-1 basis-0 items-center">
        <SideMenu regions={regions} />
      </div>

      <div className="flex h-full items-center">
        <LocalizedClientLink
          href="/"
          className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
          data-testid="nav-store-link">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        </LocalizedClientLink>
      </div>

      <div className="flex h-full flex-1 items-center justify-end gap-2">
        <LocalizedClientLink className="hover:text-ui-fg-base" href="/account" data-testid="nav-account-link">
          <UserIcon />
        </LocalizedClientLink>
        <Suspense
          fallback={
            <LocalizedClientLink className="hover:text-ui-fg-base flex gap-2" href="/cart" data-testid="nav-cart-link">
              <ShoppingCartIcon />
            </LocalizedClientLink>
          }>
          <CartButton />
        </Suspense>
      </div>
    </header>
  )
}
