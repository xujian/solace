'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreditCard as CreditCardIcon, Lock, User } from 'lucide-react'
import { cn } from '@lib/util'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@lib/components/ui/input-group'
import { Button } from '@lib/components/ui/button'
import { FieldGroup, FieldError } from '@lib/components/ui/field'

const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Card number must be at least 16 digits')
    .max(19, 'Card number is too long')
    .transform((val) => val.replace(/\s/g, '')),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)')
    .refine((val) => {
      const [month, year] = val.split('/')
      if (!month || !year) return false
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
      const now = new Date()
      // Set to first day of current month for comparison
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return expiry >= currentMonth
    }, 'Card has expired'),
  cvc: z.string().min(3, 'CVC must be at least 3 digits').max(4, 'CVC is too long'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
})

type CreditCardFormValues = z.infer<typeof creditCardSchema>

const CreditCard = () => {
  // Formatting helpers
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const parts = v.match(/.{1,4}/g) || []
    return parts.join(' ').substr(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    let v = value.replace(/\D/g, '')
    if (v.length > 2) {
      v = v.substr(0, 2) + '/' + v.substr(2, 2)
    }
    return v.substr(0, 5)
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <InputGroup>
        <InputGroupAddon align="block-start" className="text-xs font-semibold uppercase tracking-wider opacity-70">
          Card Number
        </InputGroupAddon>
        <InputGroupInput
          placeholder="0000 0000 0000 0000"
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value)
          }}
          className="text-base font-medium"
        />
        <InputGroupAddon align="inline-end">
          <Lock className="text-muted-foreground/50 size-4" />
        </InputGroupAddon>
      </InputGroup>

      <div className="flex gap-2">
        <InputGroup>
          <InputGroupAddon align="block-start" className="text-xs font-semibold uppercase tracking-wider opacity-70">
            Expiry Date
          </InputGroupAddon>
          <InputGroupInput
            placeholder="MM / YY"
            onChange={(e) => {
              const formatted = formatExpiryDate(e.target.value)
            }}
            className="font-medium"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="block-start" className="text-xs font-semibold uppercase tracking-wider opacity-70">
            CVC
          </InputGroupAddon>
          <InputGroupInput
            placeholder="123"
            maxLength={4}
            className="font-medium"
          />
        </InputGroup>
      </div>

      <InputGroup>
        <InputGroupAddon align="block-start" className="text-xs font-semibold uppercase tracking-wider opacity-70">
          Cardholder Name
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Name on card"
          className="font-medium"
        />
        <InputGroupAddon align="inline-end">
          <User className="text-muted-foreground/50 size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default CreditCard
