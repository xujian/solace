'use server'

import { HttpTypes, StoreRegion } from '@medusajs/types'
import medusaError from '@lib/util/medusa-error'
import { sdk } from '@lib/config'
import { getCacheOptions } from './cookies'

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions('regions'))
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: 'GET',
      next,
      cache: 'force-cache'
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(['regions', id].join('-')))
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: 'GET',
      next,
      cache: 'force-cache'
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (code: string): Promise<HttpTypes.StoreRegion> => {
  const us = regionMap.get('us')!
  try {
    if (regionMap.has(code)) {
      return regionMap.get(code) || us
    }

    const regions = await listRegions()

    if (!regions) {
      return us
    }

    regions.forEach(region => {
      region.countries?.forEach(c => {
        regionMap.set(c?.iso_2 ?? '', region)
      })
    })

    const region = code ? regionMap.get(code) : regionMap.get('us')

    return region || us
  } catch (e: any) {
    return us
  }
}

export const listCountries = async () => {
  return listRegions()
    .then(regions => 
      regions.map(region => region.countries?.map(c => c.iso_2))
      .flat()
      .filter(Boolean) as string[]
    )
}