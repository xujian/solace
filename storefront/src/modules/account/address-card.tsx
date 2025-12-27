'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@lib/components/ui'
import { useInteractive } from '@lib/context'
import { deleteAddress } from '@lib/data/customer'
import { cn } from '@lib/util'
import { HttpTypes } from '@medusajs/types'
import {
  Edit,
  MoreVertical,
  LoaderCircle as Spinner,
  Trash2 as Trash
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import AddressForm from './address-form'

type EditAddressProps = {
  data: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const AddressCard: React.FC<EditAddressProps> = ({
  data,
  isActive = false
}) => {
  const $ = useInteractive()
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  const openAddressDialog = () => {
    $.dialog(AddressForm, {
      defaultValues: data,
      onOk: () => {
        router.refresh()
      }
    })
  }

  const removeAddress = async () => {
    $.confirm('Are you sure you want to remove this address?').then((ok) => {
      if (ok) {
        setRemoving(true)
        deleteAddress(data.id)
        setRemoving(false)
        router.refresh()
      }
    })
  }

  return (
    <>
      <Card
        className={cn('address-card h-full w-full transition-colors min-h-50')}
        data-testid="address-card">
        <CardHeader className="flex flex-row items-start justify-between p-4">
          <div className="flex flex-col">
            <CardTitle data-testid="address-name">
              {data.first_name} {data.last_name}
            </CardTitle>
            {data.company && (
              <CardDescription data-testid="address-company">
                {data.company}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={openAddressDialog}
                data-testid="address-edit-button">
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={e => {
                  e.preventDefault()
                  removeAddress()
                }}
                data-testid="address-delete-button">
                {removing ? <Spinner /> : <Trash />}
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex flex-col p-4 text-base">
          <span data-testid="address-address">
            {data.address_1}
            {data.address_2 && <span>, {data.address_2}</span>}
          </span>
          <span data-testid="address-postal-city">
            {data.postal_code}, {data.city}
          </span>
          <span data-testid="address-province-country">
            {data.province && `${data.province}, `}
            {data.country_code?.toUpperCase()}
          </span>
        </CardContent>
      </Card>
    </>
  )
}

export default AddressCard
