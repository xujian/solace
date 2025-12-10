'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Filters } from 'types/global'
import Combobox from '@modules/common/components/combobox'
import Sort from './sort'

export default function ProductFilters({ data }: { data: Filters }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value))
  }

  const categoryParam = searchParams.get('category')
  const collectionParam = searchParams.get('collection')
  const materialParam = searchParams.get('material')

  return (
    <section className="product-filters flex gap-4">
      <Combobox
        label="(Category)"
        value={categoryParam || ''}
        options={data.category.map(item => ({
          value: item.id,
          label: item.value
        }))}
        onChange={value => handleFilterChange('category', value)}
      />
      <Combobox
        label="(Collection)"
        value={collectionParam || ''}
        options={data.collection.map(item => ({
          value: item.id,
          label: item.value
        }))}
        onChange={value => handleFilterChange('collection', value)}
      />
      <Combobox
        label="(Material)"
        value={materialParam || ''}
        options={data.material.map(item => ({
          value: item.id,
          label: item.value
        }))}
        onChange={value => handleFilterChange('material', value)}
      />
      <Sort />
    </section>
  )
}
