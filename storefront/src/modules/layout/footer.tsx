import { listCategories } from '@lib/data/categories'
import { listCollections } from '@lib/data/collections'
import { cn } from '@lib/util'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default async function Footer() {
  const { collections } = await listCollections({
    fields: '*products'
  })
  const productCategories = await listCategories()

  return (
    <footer className="footer w-full flex flex-col p">
      <div className="grid grid-cols-2">
        <LocalizedClientLink
          href="/"
          className="h2 text-xl">
          Ars Breeze
        </LocalizedClientLink>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {productCategories && productCategories?.length > 0 && (
            <div className="flex flex-col gap-y-2">
              <h3 className="mb-4">Categories</h3>
              <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                {productCategories?.slice(0, 6).map(c => {
                  if (c.parent_category) {
                    return
                  }
                  const children =
                    c.category_children?.map(child => ({
                      name: child.name,
                      handle: child.handle,
                      id: child.id
                    })) || null

                  return (
                    <li className="flex flex-col gap-2 text-muted-foreground text-sm" key={c.id}>
                      <LocalizedClientLink
                        className={cn('hover:text-foreground', children && 'text-sm font-medium')}
                        href={`/categories/${c.handle}`}
                        data-testid="category-link">
                        {c.name}
                      </LocalizedClientLink>
                      {children && (
                        <ul className="grid grid-cols-1 ml-3 gap-2">
                          {children &&
                            children.map(child => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="hover:text-foreground"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link">
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {collections && collections.length > 0 && (
            <div className="flex flex-col gap-y-2">
              <h3 className="mb-4">Collections</h3>
              <ul
                className={cn('grid grid-cols-1 gap-2 text-muted-foreground text-sm', {
                  'grid-cols-2': (collections?.length || 0) > 3
                })}>
                {collections?.slice(0, 6).map(c => (
                  <li key={c.id}>
                    <LocalizedClientLink className="hover:text-foreground" href={`/collections/${c.handle}`}>
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col gap-y-2">
            <h3 className="mb-4">Info</h3>
            <ul className="grid grid-cols-1 gap-y-2 text-muted-foreground text-sm">
              <li>
                <a
                  href="https://github.com/medusajs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex mt-8 text-gray-500 w-full justify-between">
        <p className="text-xs">© {new Date().getFullYear()} Ars Breeze. All rights reserved.</p>
      </div>
    </footer>
  )
}
