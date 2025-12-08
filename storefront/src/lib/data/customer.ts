'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import medusaError from '@lib/util/medusa-error'
import { sdk } from '@lib/config'
import {
  getCartId,
  removeCartId
} from './cookies'

export const retrieveCustomer = async (): Promise<HttpTypes.StoreCustomer | null> => {

  return await sdk.store.customer
    .retrieve(
      {
        fields: '*orders'
      },
      {
        next: { tags: ['customers'] }
      }
    )
    .then(({ customer }) => customer)
    .catch(() => null)
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {

  const updateRes = await sdk.store.customer
    .update(body)
    .then(({ customer }) => customer)
    .catch(medusaError)

  revalidateTag('customers')

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get('password') as string
  const customerForm = {
    email: formData.get('email') as string,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    phone: formData.get('phone') as string
  }

  try {
  
    const token = await sdk.auth.register('customer', 'emailpass', {
      email: customerForm.email,
      password: password
    })

    const { customer: createdCustomer } = await sdk.store.customer.create(customerForm)

    await sdk.auth.login('customer', 'emailpass', {
      email: customerForm.email,
      password
    })

    revalidateTag('customers')

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
  
    await sdk.auth.login('customer', 'emailpass', { email, password }).then(async () => {
      revalidateTag('customers')
    })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(region: string) {

  await sdk.auth.logout()

  revalidateTag('customers')

  await removeCartId()

  revalidateTag('carts')

  redirect(`/${region}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }


  await sdk.store.cart.transferCart(cartId)

  revalidateTag('carts')
}

export const addCustomerAddress = async (currentState: Record<string, unknown>, formData: FormData): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
    phone: formData.get('phone') as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping
  }


  return sdk.store.customer
    .createAddress(address, {})
    .then(async ({ customer }) => {
      revalidateTag('customers')
      return { success: true, error: null }
    })
    .catch(err => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (addressId: string): Promise<void> => {


  await sdk.store.customer
    .deleteAddress(addressId)
    .then(async () => {
      revalidateTag('customers')
      return { success: true, error: null }
    })
    .catch(err => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId = (currentState.addressId as string) || (formData.get('addressId') as string)

  if (!addressId) {
    return { success: false, error: 'Address ID is required' }
  }

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get('phone') as string

  if (phone) {
    address.phone = phone
  }


  return sdk.store.customer
    .updateAddress(addressId, address)
    .then(async () => {
      revalidateTag('customers')
      return { success: true, error: null }
    })
    .catch(err => {
      return { success: false, error: err.toString() }
    })
}
