import { Suspense } from 'react'
import { StoreRegion } from '@medusajs/types'
import { listRegions } from '@lib/data/regions'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import ProfileIcon from '@modules/common/components/profile-icon'
import { NavMenu } from '@modules/home/nav-menu'
import CartIcon from '@modules/layout/cart-icon'
import SideMenu from '@modules/layout/side-menu'
import { listCollections } from '@lib/data/collections'
import { listCategories } from '@lib/data/categories'
import { ShoppingCartIcon } from 'lucide-react'

export type NavProps = {
  minimal?: boolean
}

export default async function Nav({ minimal = false }: NavProps) {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  const [{ collections }, allCategories] = await Promise.all([
    listCollections({
      limit: '6',
      fields: '*products'
    }),
    listCategories({ limit: 100 })
  ])

  const categories = allCategories.filter(c => !c.parent_category).slice(0, 6)

  return (
    <header className="glass sticky top-0 z-50 flex h-16 w-full items-center justify-around gap-2 px-2 duration-200">
      <div className="flex h-full flex-1 items-center">
        {!minimal && <SideMenu regions={regions} />}
        <NavMenu collections={collections} categories={categories} />
      </div>
      <div className="flex h-full items-center">
        <LocalizedClientLink href="/" className="flex items-center" data-testid="nav-store-link">
          <div className="logo w-32 h-10 text-foreground" />
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
