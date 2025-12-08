'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@lib/components/ui'

export function SubmitButton({
  children,
  variant = 'default',
  className,
  'data-testid': dataTestId
}: {
  children: React.ReactNode
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
  className?: string
  'data-testid'?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="lg"
      className={className}
      type="submit"
      isLoading={pending}
      variant={variant || 'default'}
      data-testid={dataTestId}>
      {children}
    </Button>
  )
}
