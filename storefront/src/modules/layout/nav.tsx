import Image from 'next/image'
import { Suspense } from 'react'
import { StoreRegion } from '@medusajs/types'
import { listRegions } from '@lib/data/regions'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import ProfileIcon from '@modules/common/components/profile-icon'
import { NavMenu } from '@modules/home/nav-menu'
import CartIcon from '@modules/layout/cart-icon'
import SideMenu from '@modules/layout/side-menu'
import { ShoppingCartIcon } from 'lucide-react'

export type NavProps = {
  minimal?: boolean
}

export default async function Nav({ minimal = false }: NavProps) {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <header className="glass sticky top-0 z-50 flex h-16 w-full items-center justify-around gap-2 px-2 duration-200">
      <div className="flex h-full flex-1 items-center">
        {!minimal && <SideMenu regions={regions} />}
        <NavMenu />
      </div>
      <div className="flex h-full items-center">
        <LocalizedClientLink href="/" className="" data-testid="nav-store-link">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        </LocalizedClientLink>
      </div>

      <div className="flex h-full flex-1 items-center justify-end gap-2">
        {!minimal && <ProfileIcon />}
        {!minimal && (
          <Suspense
            fallback={
              <LocalizedClientLink
                className="flex gap-2"
                href="/cart"
                data-testid="nav-cart-link">
                <ShoppingCartIcon />
              </LocalizedClientLink>
            }>
            <CartIcon />
          </Suspense>
        )}
      </div>
    </header>
  )
}
