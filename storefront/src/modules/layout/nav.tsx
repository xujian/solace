import Image from 'next/image'
import { Suspense } from 'react'
import { StoreRegion } from '@medusajs/types'
import { listRegions } from '@lib/data/regions'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import CartDropdown from '@modules/layout/cart-dropdown'
import SideMenu from '@modules/layout/side-menu'
import { ShoppingCartIcon } from 'lucide-react'
import ProfileIcon from '@modules/common/components/profile-icon'
import { NavMenu } from '@modules/home/nav-menu'

export type NavProps = {
  minimal?: boolean
}

export default async function Nav({ minimal = false }: NavProps) {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-around gap-2 px-2 duration-200 glass">
      <div className="flex h-full flex-1 items-center">
        {!minimal && <SideMenu regions={regions} />}
        <NavMenu />
      </div>
      <div className="flex h-full items-center">
        <LocalizedClientLink
          href="/"
          className=""
          data-testid="nav-store-link">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        </LocalizedClientLink>
      </div>

      <div className="flex h-full flex-1 items-center gap-2 justify-end">
        {!minimal && <ProfileIcon />}
        {!minimal && <Suspense
          fallback={
            <LocalizedClientLink className="flex gap-2" href="/cart" data-testid="nav-cart-link">
              <ShoppingCartIcon />
            </LocalizedClientLink>
          }>
        <CartDropdown />
        </Suspense>}
      </div>
    </header>
  )
}
