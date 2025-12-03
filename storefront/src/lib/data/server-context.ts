import { headers } from 'next/headers'
import { getRegion } from './regions'

export const getCurrentCountry = async () => {
  const headersList = await headers()
  const country = headersList.get('x-country')
  if (!country) {
    throw new Error('Country not found in headers')
  }
  return country
}

export const getCurrentRegion = async () => {
  const country = await getCurrentCountry()
  return getRegion(country)
}
