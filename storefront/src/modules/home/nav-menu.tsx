'use client'

import * as React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@lib/components/ui'

import { HttpTypes } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Image from 'next/image'

interface NavMenuProps {
  collections: HttpTypes.StoreCollection[]
  categories: HttpTypes.StoreProductCategory[]
}

export function NavMenu({ collections, categories }: NavMenuProps) {

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Collections</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 flex flex-col gap-2">
            <h4 className="text-sm font-bold">Collections</h4>
            <ul className="grid grid-cols-2 gap sm:w-[400px] md:grid-cols-3 lg:w-[600px] lg:grid-cols-4">
              {collections.map(collection => (
                <ListItem
                  key={collection.id}
                  title={collection.title}
                  href={`/collections/${collection.handle}`}
                  image={collection.products?.[0]?.thumbnail}
                />
              ))}
            </ul>
            <div className="flex justify-end">
              <LocalizedClientLink
                href={`/collections`}
                className="text-sm font-bold text-muted-foreground tracking-tighter">
                View All
              </LocalizedClientLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className="bg-transparent">Categories</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 flex flex-col gap-2">
            <h4 className="text-sm font-bold">Categories</h4>
            <ul className="grid grid-cols-4 gap w-[400px] md:w-[600px]">
              {categories.map(category => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/categories/${category.handle}`}
                  image={category.products?.[0]?.thumbnail}
                />
              ))}
            </ul>
            <div className="flex justify-end">
              <LocalizedClientLink
                href={`/collections`}
                className="text-sm font-bold text-muted-foreground tracking-tighter">
                View All
              </LocalizedClientLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface ListItemProps extends React.ComponentPropsWithoutRef<'li'> {
  title: string
  href: string
  image?: string | null
}

function ListItem({
  title,
  href,
  image,
  ...props
}: ListItemProps) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <LocalizedClientLink
          href={href}
          className="group relative flex aspect-square w-full items-end overflow-hidden rounded-md border bg-muted no-underline transition-all"
        >
          {image ? (
            <Image
              src={image!}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Shop</span>
            </div>
          )}

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

          {/* Compact Title Overlay */}
          <div className="relative z-10 w-full p-2 text-center">
            <div className="truncate text-[10px] font-bold tracking-tight text-white uppercase drop-shadow-md">
              {title}
            </div>
          </div>
        </LocalizedClientLink>
      </NavigationMenuLink>
    </li>
  )
}
