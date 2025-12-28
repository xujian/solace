'use client'
import { useInteractive } from '@arsbreeze/interactive'
import { HttpTypes } from '@medusajs/types'
import { Card, CardContent } from '@lib/components/ui'
import AddressForm from './address-form'
import { Plus } from 'lucide-react'

const AddAddress = ({
  addresses
}: {
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const $ = useInteractive()

  const open = () => {
    $.dialog(AddressForm, {
      defaultValues: undefined
    })
  }

  return (
    <Card
      className="min-h-50 cursor-pointer border-dotted hover:bg-muted"
      onClick={open}>
      <CardContent className="flex h-full w-full flex-col items-center justify-center p-0">
        <Plus className="size-12" />
        <p className="-mb-1em text-sm text-muted-foreground">Add New address</p>
      </CardContent>
    </Card>
  )
}

export default AddAddress
